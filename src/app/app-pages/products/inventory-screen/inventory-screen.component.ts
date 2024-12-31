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
        if (rowNumber === 1) return;

        const sku = row.getCell(1).value?.toString() || '';
        const name = row.getCell(2).value?.toString() || '';
        const availableQuantity = Number(row.getCell(3).value) || 0;
        const updatedQuantity = Number(row.getCell(4).value) || 0;
        const quantityToEdit = Number(row.getCell(5).value) || 0;
        const costPerUnit = Number(row.getCell(6).value) || 0;

        if (!sku || costPerUnit <= 0) {
          this.uploadStatus = `Invalid data at row ${rowNumber}`;
          return;
        }

        const fifoLayers = [];
        if (quantityToEdit > 0) {
          fifoLayers.push({ quantity: quantityToEdit, costPerUnit });
        }

        updates.push({
          sku,
          updatedQuantity: updatedQuantity || availableQuantity,
          fifoLayers,
        });
      });

      this.updateInventory(updates);
    } catch (error) {
      console.error('Error reading Excel file:', error);
      this.uploadStatus =
        'Failed to read Excel file. Please ensure it is properly formatted.';
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

  fetchInventory(): void {
    this.loading = true;
    this.productService.fetchInventory(this.startDate, this.endDate).subscribe({
      next: (data) => {
        // Directly assign the data without recalculating
        this.inventoryItems = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching inventory:', error);
        this.loading = false;
      },
    });
  }
  
  calculateOpeningBalance(movements: any[]): number {
    if (!movements || !Array.isArray(movements)) return 0;
    return movements
      .filter(
        (movement) => new Date(movement.createdAt) < new Date(this.startDate)
      )
      .reduce(
        (sum, movement) =>
          movement.type === 'IN' ? sum + movement.quantity : sum,
        0
      );
  }

  calculateTotalIn(movements: any[]): number {
    if (!movements || !Array.isArray(movements)) return 0;
    return movements
      .filter(
        (movement) =>
          new Date(movement.createdAt) >= new Date(this.startDate) &&
          movement.type === 'IN'
      )
      .reduce((sum, movement) => sum + movement.quantity, 0);
  }

  calculateTotalOut(movements: any[]): number {
    if (!movements || !Array.isArray(movements)) return 0;
    return movements
      .filter(
        (movement) =>
          new Date(movement.createdAt) >= new Date(this.startDate) &&
          movement.type === 'OUT'
      )
      .reduce((sum, movement) => sum + movement.quantity, 0);
  }

  exportToExcel(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Inventory Report');

    worksheet.columns = [
      { header: 'Name', key: 'name', width: 20 },
      { header: 'SKU', key: 'sku', width: 15 },
      { header: 'Category', key: 'category', width: 20 },
      { header: 'Opening Balance', key: 'openingBalance', width: 20 },
      { header: 'Total In', key: 'totalIn', width: 15 },
      { header: 'Total Out', key: 'totalOut', width: 15 },
      { header: 'Closing Balance', key: 'closingBalance', width: 20 },
      { header: 'Available Stock', key: 'availableStock', width: 20 },
      { header: 'Cost/Unit', key: 'costPerUnit', width: 15 },
      { header: 'Total Cost', key: 'totalCost', width: 15 },
      { header: 'Valuation Method', key: 'valuationMethod', width: 20 },
    ];

    this.inventoryItems.forEach((item) => {
      worksheet.addRow({
        name: item.name,
        sku: item.sku || 'N/A',
        category: item.category || 'N/A',
        openingBalance: item.openingBalance || 0,
        totalIn: item.totalIn || 0,
        totalOut: item.totalOut || 0,
        closingBalance: item.closingBalance || 0,
        availableStock: item.availableStock || 0,
        costPerUnit: item.costPerUnit || '0.00',
        totalCost: item.totalCost || 0,
        valuationMethod: item.valuationMethod || 'FIFO',
      });
    });

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, 'Inventory_Report.xlsx');
    });
  }

  exportTemplate(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Inventory Template');

    worksheet.columns = [
      { header: 'SKU', key: 'sku', width: 20 },
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Available Quantity', key: 'availableQuantity', width: 20 },
      { header: 'Updated Quantity', key: 'updatedQuantity', width: 20 },
      { header: 'Quantity to Edit', key: 'quantityToEdit', width: 20 },
      { header: 'Cost Per Unit', key: 'costPerUnit', width: 15 },
    ];

    this.productService.getProducts().subscribe({
      next: (products) => {
        products.forEach((product) => {
          worksheet.addRow({
            sku: product.barcode,
            name: product.name,
            availableQuantity: product.stock || 0,
            updatedQuantity: product.stock || 0,
            quantityToEdit: 0,
            costPerUnit: product.costPrice || 0,
          });
        });

        workbook.xlsx.writeBuffer().then((data) => {
          const blob = new Blob([data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
          saveAs(blob, 'Inventory_Template.xlsx');
        });
      },
      error: (err) => {
        console.error('Error fetching products for template:', err);
      },
    });
  }
}
