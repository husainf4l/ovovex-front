import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientsService } from '../../../services/clients.service';
import { CommonModule } from '@angular/common';


interface Transaction {
  createdAt: Date;
  debit: number;
  credit: number;
  notes: string;
}

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.css'],
  imports: [CommonModule]
})
export class ClientDetailsComponent implements OnInit {
  clientId: string | null = null;
  client: any = null;
  accountStatement: any[] = [];
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private clientsService: ClientsService
  ) { }

  ngOnInit(): void {
    this.clientId = this.route.snapshot.paramMap.get('id');
    if (this.clientId) {
      this.loadClientDetails(this.clientId);
    }
  }


  loadClientDetails(clientId: string): void {
    this.clientsService.getClientDetails(clientId).subscribe({
      next: (data) => {
        this.client = data.clientDetails;

        // Calculate the cycle balance (sum of transactions before the earliest transaction date)
        const startDate = new Date(); // Example: you can define this dynamically
        let cycleBalance = 0;

        const previousTransactions = (data.clientDetails.Transaction || []).filter(
          (transaction: any) => new Date(transaction.createdAt) < startDate
        );

        previousTransactions.forEach((transaction: any) => {
          cycleBalance += transaction.debit - transaction.credit;
        });

        // Add a cycle balance entry
        this.accountStatement = [
          {
            date: startDate.toISOString(), // Represents the start of the new cycle
            description: 'Cycle Balance',
            debit: null,
            credit: null,
            runningBalance: cycleBalance,
            notes: 'Balance carried forward from previous transactions',
          },
        ];

        // Process transactions within the period and calculate running balance
        let runningBalance = cycleBalance;

        const filteredTransactions = (data.clientDetails.Transaction || []).filter(
          (transaction: any) => new Date(transaction.createdAt) >= startDate
        );

        const transactions = filteredTransactions.map((transaction: any) => {
          runningBalance += transaction.debit - transaction.credit;
          return {
            date: transaction.createdAt,
            description: 'Transaction',
            debit: transaction.debit,
            credit: transaction.credit,
            runningBalance: runningBalance,
            notes: transaction.notes,
          };
        });

        // Combine the cycle balance with the filtered transactions
        this.accountStatement = [...this.accountStatement, ...transactions];

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading client details:', err);
        this.isLoading = false;
      },
    });
  }



}
