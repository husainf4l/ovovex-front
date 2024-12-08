import { CommonModule } from '@angular/common';
import { Component, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { colors } from '../../models/colors.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule]
})
export class DashboardComponent implements AfterViewInit {
  kpis = {
    revenue: 500000,
    expenses: 350000,
    netProfit: 150000,
    inflow: 400000,
    outflow: 300000,
  };

  accountsOverview = {
    assets: 1000000,
    liabilities: 600000,
    equity: 400000,
  };
  recentTransactions = [
    { date: '2024-12-01', description: 'Invoice Payment #2024', amount: 5000, type: 'Credit' },
    { date: '2024-12-02', description: 'Purchase Office Supplies', amount: 700, type: 'Debit' },
    { date: '2024-12-03', description: 'Salary Payment', amount: 15000, type: 'Debit' },
    { date: '2024-12-04', description: 'Client Payment', amount: 10000, type: 'Credit' },
    { date: '2024-12-05', description: 'Utility Bill', amount: 1200, type: 'Debit' },
  ];

  profitMargins = [15, 18, 20, 22, 19, 24, 28, 30, 27, 25, 29, 32];
  cashFlowData = [60000, 62000, 58000, 63000, 64000, 67000];
  expenseBreakdown = [50, 20, 15, 10, 5];

  ngAfterViewInit() {
    this.initializeCharts();
  }

  initializeCharts() {
    // Revenue Trends (Line Chart)
    new Chart('revenueChart', {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Revenue',
            data: [12000, 15000, 13000, 17000, 19000, 21000],
            borderColor: colors.primary,
            backgroundColor: 'rgba(63, 81, 181, 0.2)', // Primary 20%
            tension: 0.4,
          },
        ],
      },
      options: {
        plugins: { legend: { display: true } },
        scales: {
          x: { grid: { display: false } },
          y: { grid: {} },
        },
      },
    });

    // Expense Breakdown (Pie Chart)
    new Chart('expenseChart', {
      type: 'pie',
      data: {
        labels: ['Salaries', 'Utilities', 'Marketing', 'Supplies', 'Other'],
        datasets: [
          {
            data: this.expenseBreakdown,
            backgroundColor: [
              colors.primary,
              colors.accent,
              colors.success,
              colors.info,
              colors.grey,
            ],
          },
        ],
      },
      options: {
        plugins: { legend: { position: 'right' } },
      },
    });

    // Accounts Overview (Bar Chart)
    new Chart('accountsChart', {
      type: 'bar',
      data: {
        labels: ['Assets', 'Liabilities', 'Equity'],
        datasets: [
          {
            label: 'Amount',
            data: [this.accountsOverview.assets, this.accountsOverview.liabilities, this.accountsOverview.equity],
            backgroundColor: [colors.success, colors.warn, colors.accent],
          },
        ],
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: { grid: {} },
        },
      },
    });

    // Cash Flow Analysis (Stacked Bar Chart)
    new Chart('cashFlowChart', {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Inflow',
            data: this.cashFlowData,
            backgroundColor: colors.success,
          },
          {
            label: 'Outflow',
            data: [40000, 45000, 42000, 47000, 46000, 49000],
            backgroundColor: colors.warn,
          },
        ],
      },
      options: {
        plugins: { legend: { position: 'top' } },
        scales: {
          x: { grid: { display: false } },
          y: { grid: {} },
        },
      },
    });

    // Profit Margins (Radar Chart)
    new Chart('profitMarginChart', {
      type: 'radar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Profit Margin (%)',
            data: this.profitMargins,
            borderColor: colors.accent,
            backgroundColor: 'rgba(233, 30, 99, 0.2)', // Accent 20%
          },
        ],
      },
      options: {
        plugins: { legend: { display: true } },
      },
    });

    // Net Profit Trends (Line Chart)
    new Chart('netProfitChart', {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
          {
            label: 'Net Profit',
            data: [12000, 15000, 17000, 19000, 21000, 23000, 25000],
            borderColor: colors.grey,
            backgroundColor: 'rgba(158, 158, 158, 0.2)', // Grey 20%
            tension: 0.4,
          },
        ],
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: { grid: {} },
        },
      },
    });
  }

}
