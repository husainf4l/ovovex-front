import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inventory-screen',
  templateUrl: './inventory-screen.component.html',
  styleUrls: ['./inventory-screen.component.css'],
  imports: [CommonModule, FormsModule],
})
export class InventoryScreenComponent implements OnInit {
  startDate: string = new Date('2024-12-01').toISOString().split('T')[0];
  endDate: string = new Date('2024-12-31').toISOString().split('T')[0];
  inventoryItems: any[] = [];
  loading: boolean = false;
  uploadStatus: string = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.fetchInventory();
  }

  fetchInventory(): void {
    this.loading = true;
    this.productService.fetchInventory(this.startDate, this.endDate).subscribe({
      next: (data) => {
        this.inventoryItems = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching inventory:', error);
        this.loading = false;
      },
    });
  }

  updateDateRange(start: string, end: string): void {
    this.startDate = start;
    this.endDate = end;
    this.fetchInventory();
  }

  async handleExcelFileUpload(event: Event): Promise<void> {
    const target = event.target as HTMLInputElement;
    if (!target.files || target.files.length === 0) return;

    const file = target.files[0];
    const workbook = new ExcelJS.Workbook();

    try {
      await workbook.xlsx.load(await file.arrayBuffer());
      const worksheet = workbook.getWorksheet(1);

      if (!worksheet) {
        this.uploadStatus = 'No valid worksheet found in the uploaded file.';
        return;
      }

      const updates: any[] = [];
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip header row

        const sku = row.getCell(1).value?.toString() || '';
        const updatedQuantity = Number(row.getCell(2).value) || 0;
        const fifoLayers = JSON.parse(row.getCell(3).value?.toString() || '[]');

        if (!sku || updatedQuantity <= 0 || !Array.isArray(fifoLayers)) {
          this.uploadStatus = `Invalid data at row ${rowNumber}`;
          return;
        }

        updates.push({ sku, updatedQuantity, fifoLayers });
      });

      this.updateInventory(updates);
    } catch (error) {
      console.error('Error reading Excel file:', error);
      this.uploadStatus = 'Failed to read Excel file.';
    }
  }

  updateInventory(updates: any[]): void {
    this.uploadStatus = 'Uploading inventory updates...';
    this.productService.updateInventory(updates).subscribe({
      next: () => {
        this.uploadStatus = 'Inventory updated successfully!';
        this.fetchInventory();
      },
      error: (error) => {
        console.error('Error updating inventory:', error);
        this.uploadStatus = 'Error updating inventory. Please try again.';
      },
    });
  }

  exportToExcel(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Inventory Template');

    worksheet.columns = [
      { header: 'SKU', key: 'sku', width: 20 },
      { header: 'Updated Quantity', key: 'updatedQuantity', width: 20 },
      { header: 'FIFO Layers', key: 'fifoLayers', width: 50 },
    ];

    this.inventoryItems.forEach((item) => {
      worksheet.addRow({
        sku: item.sku,
        updatedQuantity: item.stock,
        fifoLayers: JSON.stringify([
          { quantity: item.stock, costPerUnit: item.costPrice },
        ]),
      });
    });

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, 'Inventory_Template.xlsx');
    });
  }

  calculateCostPerUnit(totalCost: number, closingBalance: number): string {
    return closingBalance && totalCost
      ? (totalCost / closingBalance).toFixed(2)
      : 'N/A';
  }

  printPage(): void {
    const printContent = document.getElementById('print-area')?.innerHTML;
    const newWindow = window.open('', '_blank');
    if (newWindow && printContent) {
      newWindow.document.write(`
        <html>
          <head>
            <title>Print Inventory Report</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              table { border-collapse: collapse; width: 100%; }
              th, td { border: 1px solid #ddd; padding: 8px; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>${printContent}</body>
        </html>
      `);
      newWindow.document.close();
      newWindow.print();
    }
  }
}
