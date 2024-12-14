import { Component, OnInit } from '@angular/core';
import { FinancialService } from '../../../services/financial.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-financial-report',
  templateUrl: './financial-report.component.html',
  styleUrls: ['./financial-report.component.css'],
  imports: [CommonModule, FormsModule]
})
export class FinancialReportComponent implements OnInit {
  incomeStatement: any = null;
  isLoading = false;

  // Default date range (current year)
  startDate = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];
  endDate = new Date().toISOString().split('T')[0];

  constructor(private financialService: FinancialService) { }

  ngOnInit(): void {
    this.fetchIncomeStatement();
  }

  fetchIncomeStatement(): void {
    this.isLoading = true;

    this.financialService.getIncomeStatement(this.startDate, this.endDate).subscribe({
      next: (data) => {
        this.incomeStatement = {
          totalRevenue: data.totalRevenue,
          totalCOGS: data.totalCOGS,
          grossProfit: data.grossProfit,
          totalOperatingExpenses: data.totalOperatingExpenses,
          operatingProfit: data.operatingProfit,
          otherIncome: data.otherIncome || 0,
          otherExpenses: data.otherExpenses || 0,
          profitBeforeTax: data.operatingProfit + (data.otherIncome || 0) - (data.otherExpenses || 0),
          taxExpense: data.taxExpense || 0,
          netProfitOrLoss:
            data.operatingProfit + (data.otherIncome || 0) - (data.otherExpenses || 0) - (data.taxExpense || 0),
        };
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching income statement:', err);
        this.isLoading = false;
      },
    });
  }
}
