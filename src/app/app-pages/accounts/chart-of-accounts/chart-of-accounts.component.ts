import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Account } from '../../../models/interfaces.model';
import { ChartOfAccountsService } from '../../../services/chart-of-accounts.service';
import { RouterLink } from '@angular/router';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-chart-of-accounts',
  templateUrl: './chart-of-accounts.component.html',
  styleUrls: ['./chart-of-accounts.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, RouterLink],
  providers: [ChartOfAccountsService],
})
export class ChartOfAccountsComponent implements OnInit {
  chartOfAccounts: Account[] = [];
  displayedAccounts: Account[] = [];
  searchQuery: string = '';
  loading: boolean = false;
  error: string | null = null;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  debouncedSearch: any;

  constructor(private chartOfAccountsService: ChartOfAccountsService) { }

  ngOnInit(): void {
    this.fetchChartOfAccounts();
  }

  fetchChartOfAccounts(): void {
    this.loading = true;
    this.error = null;

    this.chartOfAccountsService.getAccounts().subscribe({
      next: (data) => {
        this.chartOfAccounts = data;
        this.displayedAccounts = [...this.chartOfAccounts];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching accounts:', err);
        this.error = 'Failed to load chart of accounts. Please try again later.';
        this.loading = false;
      },
    });
  }

  initialize() {
    this.chartOfAccountsService.initializeAccounts().subscribe();
  }

  onSearch(query: string): void {
    clearTimeout(this.debouncedSearch);
    this.debouncedSearch = setTimeout(() => {
      this.searchQuery = query.toLowerCase();
      this.filterAndSort();
    }, 300);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.filterAndSort();
  }

  downloadAsExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Chart of Accounts');

    worksheet.addRow([
      'Account Number',
      'Account Name',
      'Account Type',
      'Opening Balance',
      'Debit Transactions',
      'Credit Transactions',
      'Current Balance',
    ]);

    this.displayedAccounts.forEach((account) => {
      worksheet.addRow([
        account.hierarchyCode,
        account.name,
        account.accountType,
        account.openingBalance,
        account.totalDebit,
        account.totalCredit,
        account.currentBalance,
      ]);
    });

    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    worksheet.columns.forEach((column) => {
      column.width = column.header
        ? Math.max(column.header.toString().length + 2, 12)
        : 12;
    });

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, `Chart_of_Accounts_${new Date().toISOString().slice(0, 10)}.xlsx`);
    });
  }

  reconsole(): void {
    this.loading = true;
    this.error = null;

    this.chartOfAccountsService.reconsole().subscribe({
      next: (data) => {
        this.chartOfAccounts = data;
        this.displayedAccounts = [...this.chartOfAccounts];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching accounts:', err);
        this.error = 'Failed to load chart of accounts. Please try again later.';
        this.loading = false;
      },
    });
  }

  sort(column: string): void {
    if (this.sortColumn === column) {
      // Toggle sorting direction if the same column is clicked
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Set the new column for sorting
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.filterAndSort(); // Apply sorting
  }

  filterAndSort() {
    let filtered = this.chartOfAccounts.filter(
      (account) =>
        account.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        account.hierarchyCode.toLowerCase().includes(this.searchQuery.toLowerCase())
    );

    if (this.sortColumn) {
      filtered = filtered.sort((a, b) => {
        const valA = a[this.sortColumn as keyof Account] as string | number;
        const valB = b[this.sortColumn as keyof Account] as string | number;

        if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    this.displayedAccounts = filtered;
  }
}
