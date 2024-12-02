import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Account } from '../../models/interfaces.model';
import { ChartOfAccountsService } from '../../services/chart-of-accounts.service';

@Component({
  selector: 'app-chart-of-accounts',
  templateUrl: './chart-of-accounts.component.html',
  styleUrls: ['./chart-of-accounts.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
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
        this.error = 'Failed to load chart of accounts. Please try again later.';
        this.loading = false;
      },
    });
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
}
