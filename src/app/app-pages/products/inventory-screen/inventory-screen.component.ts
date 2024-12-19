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
  imports: [CommonModule, FormsModule]
})
export class InventoryScreenComponent implements OnInit {
  startDate = new Date('2024-12-01').toISOString().split('T')[0];
  endDate = new Date('2024-12-31').toISOString().split('T')[0];
  inventoryItems: any[] = [];
  loading = false;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.fetchInventory();
  }

  fetchInventory(): void {
    this.loading = true;
    this.productService.fetchInventory(this.startDate, this.endDate).subscribe({
      next: (data) => {
        console.log('Raw Data:', data); // Debugging

        this.inventoryItems = data.map((item) => {
          // Ensure `movements` is an array
          const movements = Array.isArray(item.movements) ? item.movements : [];
          console.log('Movements for item:', item.name, movements); // Debugging

          return {
            ...item,
            totalCost: this.calculateFIFO(movements, item.closingBalance),
            costValidationError: this.isCostAboveNRV(item.totalCost, item.nrv),
          };
        });

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

  calculateFIFO(movements: any[], closingBalance: number): number {
    let remainingBalance = closingBalance;
    let totalCost = 0;

    for (const movement of movements) {
      if (remainingBalance <= 0) break;

      const usedQuantity = Math.min(remainingBalance, movement.quantity);
      totalCost += usedQuantity * movement.costPerUnit;
      remainingBalance -= usedQuantity;
    }

    return totalCost;
  }

  isCostAboveNRV(totalCost: number, nrv: number): boolean {
    return totalCost > nrv;
  }

  exportToExcel(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Inventory Report');

    worksheet.columns = [
      { header: 'Name', key: 'name', width: 20 },
      { header: 'SKU', key: 'sku', width: 15 },
      { header: 'Category', key: 'category', width: 20 },
      { header: 'Opening Balance', key: 'openingBalance', width: 20 },
      { header: 'Closing Balance', key: 'closingBalance', width: 20 },
      { header: 'Cost/Unit', key: 'costPerUnit', width: 15 },
      { header: 'Total Cost', key: 'totalCost', width: 15 },
      { header: 'NRV', key: 'nrv', width: 15 },
      { header: 'Validation', key: 'validation', width: 20 },
      { header: 'Valuation Method', key: 'valuationMethod', width: 20 },
    ];

    this.inventoryItems.forEach((item) => {
      worksheet.addRow({
        name: item.name,
        sku: item.sku,
        category: item.category,
        openingBalance: item.openingBalance,
        closingBalance: item.closingBalance,
        costPerUnit: item.totalCost / item.closingBalance || 0,
        totalCost: item.totalCost,
        nrv: item.nrv,
        validation: item.costValidationError ? 'Needs Adjustment' : 'Valid',
        valuationMethod: item.valuationMethod,
      });
    });

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, 'Inventory_Report.xlsx');
    });
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
              body {
                font-family: Arial, sans-serif;
                margin: 20px;
              }
              table {
                border-collapse: collapse;
                width: 100%;
              }
              th, td {
                border: 1px solid #ddd;
                padding: 8px;
              }
              th {
                background-color: #f2f2f2;
              }
            </style>
          </head>
          <body>${printContent}</body>
        </html>
      `);
      newWindow.document.close();
      newWindow.print();
    }
  }

  handleJournalEntry(): void {
    alert('Journal Entry functionality will be implemented soon!');
  }
}