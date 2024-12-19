import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

import jsPDF from 'jspdf';

interface InventoryMovement {
  date: Date;
  type: 'inflow' | 'outflow';
  quantity: number;
  costPerUnit: number; // Applicable for inflow only
}

interface InventoryItem {
  adjustmentRequired?: boolean; // Indicates if an adjustment journal is needed
}

interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  category: string;
  openingBalance: number;
  openingCost: number; // Cost of the opening balance
  movements: InventoryMovement[];
  closingBalance: number;
  totalCost: number;
  nrv: number;
  valuationMethod: 'FIFO' | 'WAC'; // Valuation method
  costValidationError?: boolean; // Validation flag
}

@Component({
  selector: 'app-inventory-screen',
  templateUrl: './inventory-screen.component.html',
  styleUrls: ['./inventory-screen.component.css'],
  imports: [CommonModule, FormsModule],
})
export class InventoryScreenComponent implements OnInit {
  startDate = new Date('2024-12-01');
  endDate = new Date('2024-12-31');
  inventoryItems: InventoryItem[] = [
    {
      id: 1,
      name: 'Laptop',
      sku: '001',
      category: 'Electronics',
      openingBalance: 10,
      openingCost: 15000,
      movements: [
        {
          date: new Date('2024-12-05'),
          type: 'inflow',
          quantity: 5,
          costPerUnit: 1600,
        },
        {
          date: new Date('2024-12-10'),
          type: 'outflow',
          quantity: 3,
          costPerUnit: 0,
        },
      ],
      closingBalance: 0,
      totalCost: 0,
      nrv: 17500,
      valuationMethod: 'FIFO',
    },
    {
      id: 2,
      name: 'Raw Cotton',
      sku: '002',
      category: 'Raw Materials',
      openingBalance: 100,
      openingCost: 500,
      movements: [
        {
          date: new Date('2024-12-02'),
          type: 'inflow',
          quantity: 20,
          costPerUnit: 6,
        },
        {
          date: new Date('2024-12-15'),
          type: 'outflow',
          quantity: 30,
          costPerUnit: 2,
        },
      ],
      closingBalance: 0,
      totalCost: 0,
      nrv: 700,
      valuationMethod: 'WAC',
    },
  ];

  constructor() {}

  ngOnInit(): void {
    this.calculateBalances();
  }
  exportToCSV(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Inventory Report');

    worksheet.columns = [
      { header: 'Name', key: 'name' },
      { header: 'SKU', key: 'sku' },
      { header: 'Category', key: 'category' },
      { header: 'Opening Balance', key: 'openingBalance' },
      { header: 'Closing Balance', key: 'closingBalance' },
      { header: 'Cost/Unit', key: 'costPerUnit' },
      { header: 'Total Cost', key: 'totalCost' },
      { header: 'NRV', key: 'nrv' },
      { header: 'Validation', key: 'validation' },
      { header: 'Valuation Method', key: 'valuationMethod' },
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

    workbook.csv.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, 'Inventory_Report.csv');
    });
  }

  generateAdjustmentJournal(): void {
    const itemsNeedingAdjustment = this.inventoryItems.filter(
      (item) => item.adjustmentRequired
    );
    console.log('Generating journal for:', itemsNeedingAdjustment);
    // Logic to create a journal entry in your system
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

    // Add a blank row to separate data and the footer
    worksheet.addRow([]);

    // Add the custom footer string
    worksheet.addRow(['', '', '', 'شركة بابايا التجارية']); // "Hello" will be placed in the first column

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, 'Inventory_Report.xlsx');
    });
  }

  updateDateRange(start: string | undefined, end: string | undefined): void {
    if (start) this.startDate = new Date(start);
    if (end) this.endDate = new Date(end);
    this.calculateBalances();
  }

  // FIFO valuation method
  calculateFIFO(
    openingBalance: number,
    openingCost: number,
    inflows: InventoryMovement[],
    outflows: InventoryMovement[]
  ): number {
    let remainingBalance = openingBalance;
    let totalCost = openingCost;

    inflows.forEach((movement) => {
      totalCost += movement.quantity * movement.costPerUnit;
      remainingBalance += movement.quantity;
    });

    outflows.forEach((movement) => {
      const outflowQuantity = Math.min(movement.quantity, remainingBalance);
      if (remainingBalance > 0) {
        totalCost -= (totalCost / remainingBalance) * outflowQuantity;
        remainingBalance -= outflowQuantity;
      }
    });

    return Math.max(totalCost, 0);
  }

  hasInvalidCosts(): boolean {
    return this.inventoryItems.some((item) => item.costValidationError);
  }

  areAllCostsValid(): boolean {
    return !this.hasInvalidCosts();
  }

  // Weighted Average Cost (WAC) method
  calculateWAC(
    openingBalance: number,
    openingCost: number,
    inflows: InventoryMovement[],
    outflows: InventoryMovement[]
  ): number {
    let totalQuantity = openingBalance;
    let totalCost = openingCost;

    inflows.forEach((movement) => {
      totalCost += movement.quantity * movement.costPerUnit;
      totalQuantity += movement.quantity;
    });

    const averageCost = totalCost / totalQuantity;

    const totalOutflow = outflows.reduce((sum, m) => sum + m.quantity, 0);
    totalQuantity -= totalOutflow;

    return Math.max(totalQuantity * averageCost, 0);
  }
  filterMovementsByDate(
    item: InventoryItem,
    startDate: Date,
    endDate: Date
  ): InventoryMovement[] {
    return item.movements.filter(
      (movement) => movement.date >= startDate && movement.date <= endDate
    );
  }
  calculateBalances(): void {
    this.inventoryItems.forEach((item) => {
      const inflows = this.filterMovementsByDate(
        item,
        this.startDate,
        this.endDate
      ).filter((m) => m.type === 'inflow');
      const outflows = this.filterMovementsByDate(
        item,
        this.startDate,
        this.endDate
      ).filter((m) => m.type === 'outflow');

      const totalInflow = inflows.reduce((sum, m) => sum + m.quantity, 0);
      const totalOutflow = outflows.reduce((sum, m) => sum + m.quantity, 0);

      item.closingBalance = item.openingBalance + totalInflow - totalOutflow;

      if (item.valuationMethod === 'FIFO') {
        item.totalCost = this.calculateFIFO(
          item.openingBalance,
          item.openingCost,
          inflows,
          outflows
        );
      } else if (item.valuationMethod === 'WAC') {
        item.totalCost = this.calculateWAC(
          item.openingBalance,
          item.openingCost,
          inflows,
          outflows
        );
      }

      // Flag if adjustment is needed
      item.costValidationError = item.totalCost > item.nrv;
      if (item.costValidationError) {
        item.totalCost = item.totalCost;
        item.adjustmentRequired = true;
      } else {
        item.adjustmentRequired = false;
      }
    });
  }

  printReport(): void {
    console.log('Print button clicked!'); // Debugging message

    const printContents = document.getElementById('printable-area')?.innerHTML;
    if (printContents) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(`
        <html>
          <head>
            <title>Inventory Report</title>
            <style>
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid black; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <h1>Inventory Report</h1>
            ${printContents}
          </body>
        </html>
      `);
        printWindow.document.close();
        printWindow.print();
      } else {
        console.error('Failed to open print window!');
      }
    } else {
      console.error('No printable content found!');
    }
  }
}
