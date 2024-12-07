import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../../services/account.service';
import { SearchInputComponent } from "../../../components/shared/search-input/search-input.component";
import { ChartOfAccountsService } from '../../../services/chart-of-accounts.service';

@Component({
  selector: 'app-account-statement',
  templateUrl: './account-statement.component.html',
  styleUrls: ['./account-statement.component.css'],
  imports: [CommonModule, FormsModule, SearchInputComponent],
})
export class AccountStatementComponent implements OnInit {
  accountId: string | null = null;
  accountDetails: any;
  transactions: any[] = [];
  pagination = { currentPage: 1, totalPages: 0, totalRecords: 0 };
  filters = { startDate: '', endDate: '' };
  loading = false;
  error = '';
  openingBalance = 0;
  totalDebits = 0;
  totalCredits = 0;
  accounts: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private chartOfAccountsService: ChartOfAccountsService
  ) {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    // Initialize filters
    this.filters.startDate = this.formatDate(startOfYear);
    this.filters.endDate = this.formatDate(today);
  }

  onAccountSelected(account: any): void {
    this.accountId = account.id;
    this.router.navigate(['/account-statement', account.id]);
    this.fetchAccountStatement();
  }


  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.accountId = params['accountId'] || null;

      if (!this.accountId) {
        this.fetchAccounts();
      } else {
        this.fetchAccountStatement();
      }
    });
  }

  fetchAccounts(): void {
    this.loading = true;

    this.chartOfAccountsService.getAccounts().subscribe({
      next: (data) => {
        this.accounts = data.map((account: any) => ({
          id: account.id,
          name: account.name,
          accountType: account.accountType,
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching accounts:', err);
        this.error = 'Failed to load accounts. Please try again later.';
        this.loading = false;
      },
    });
  }

  fetchAccountStatement(page: number = 1): void {
    if (!this.accountId) {
      this.error = 'Account ID is missing.';
      return;
    }

    this.loading = true;
    this.error = '';

    this.accountService
      .getAccountStatement(this.accountId, page, 10, this.filters)
      .subscribe(
        (data) => {
          this.accountDetails = data.accountDetails;
          this.transactions = data.transactions || [];
          this.pagination = data.pagination || {
            currentPage: 1,
            totalPages: 0,
            totalRecords: 0,
          };
          this.openingBalance = data.openingBalance || 0;

          // Calculate totals
          this.totalDebits = this.transactions.reduce((sum, t) => sum + (t.debit || 0), 0);
          this.totalCredits = this.transactions.reduce((sum, t) => sum + (t.credit || 0), 0);

          this.loading = false;
        },
        (error) => {
          this.error = 'Failed to load account statement. Please try again later.';
          this.loading = false;
        }
      );
  }

  applyFilters(): void {
    this.pagination.currentPage = 1; // Reset to the first page when applying filters
    this.fetchAccountStatement();
  }

  goToPage(page: number): void {
    if (page > 0 && page <= this.pagination.totalPages) {
      this.fetchAccountStatement(page);
    }
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  printAccountStatement(): void {
    const printContents = document.getElementById('printableInvoice')?.innerHTML;
    if (printContents) {
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      printWindow?.document.write(`
        <html>
          <head>
            <title>Account Statement</title>
            <style>
              @media print {
                body {
                  font-family: Arial, sans-serif;
                  margin: 20px;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                }
                th, td {
                  border: 1px solid #ddd;
                  padding: 8px;
                }
                th {
                  background-color: #f4f4f4;
                }
                footer {
                  position: fixed;
                  bottom: 0;
                  text-align: center;
                  font-size: 0.8rem;
                  width: 100%;
                }
              }
            </style>
          </head>
          <body>
            ${printContents}
            <footer>Company Address: 123 Business Street, City, Country</footer>
          </body>
        </html>
      `);
      printWindow?.document.close();
      printWindow?.print();
    }
  }
}
