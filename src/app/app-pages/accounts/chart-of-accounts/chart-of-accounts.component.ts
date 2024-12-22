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

  constructor(private chartOfAccountsService: ChartOfAccountsService) { }

  ngOnInit(): void {
    this.fetchChartOfAccounts();
  }

  fetchChartOfAccounts(): void {
    this.loading = true;
    this.error = null;

    this.chartOfAccountsService.getAccounts().subscribe({
      next: (data) => {
        this.chartOfAccounts = data; // Flat structure
        this.displayedAccounts = [...this.chartOfAccounts]; // Initially display all
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching accounts:', err);
        this.error =
          'Failed to load chart of accounts. Please try again later.';
        this.loading = false;
      },
    });
  }

  initialize() {
    this.chartOfAccountsService.initializeAccounts().subscribe();
  }

  onSearch(query: string): void {
    this.searchQuery = query.toLowerCase();
    this.displayedAccounts = this.chartOfAccounts.filter((account) =>
      account.name.toLowerCase().includes(this.searchQuery)
    );
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.displayedAccounts = [...this.chartOfAccounts];
  }

  downloadAsExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Chart of Accounts');

    // Add header row
    worksheet.addRow([
      'Account Number',
      'Account Name',
      'Account Type',
      'Opening Balance',
      'Debit Transactions',
      'Credit Transactions',
      'Current Balance',
    ]);

    // Add account data rows
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

    // Style the header row
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

    // Adjust column widths
    worksheet.columns.forEach((column) => {
      if (column.header) {
        column.width =
          column.header.length < 12 ? 12 : column.header.length + 2;
      } else {
        column.width = 12; // Default width if the header is undefined
      }
    });

    // Generate Excel file and trigger download
    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, 'Chart_of_Accounts.xlsx');
    });
  }

  reconsole(): void {
    this.loading = true;
    this.error = null;

    this.chartOfAccountsService.reconsole().subscribe({
      next: (data) => {
        this.chartOfAccounts = data; // Flat structure
        this.displayedAccounts = [...this.chartOfAccounts]; // Initially display all
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching accounts:', err);
        this.error =
          'Failed to load chart of accounts. Please try again later.';
        this.loading = false;
      },
    });
  }

}
