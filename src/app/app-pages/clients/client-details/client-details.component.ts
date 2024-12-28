import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientsService } from '../../../services/clients.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.css'],
  imports: [CommonModule],
})
export class ClientDetailsComponent implements OnInit {
  clientId: string | null = null;
  client: any = null;
  unifiedStatement: any[] = [];
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

  private loadClientDetails(clientId: string): void {
    this.clientsService.getClientDetails(clientId).subscribe({
      next: (data) => {
        this.client = data.clientDetails;

        // Combine invoices (as debit) and transactions (as credit)
        const invoices = (data.clientDetails.invoices || []).map((invoice: any) => ({
          date: new Date(invoice.issueDate),
          description: `Invoice #${invoice.number}`,
          debit: invoice.taxInclusiveAmount,
          credit: null,
          runningBalance: 0, // Placeholder
          notes: invoice.note || 'N/A',
        }));

        const transactions = (data.clientDetails.Transaction || []).map((transaction: any) => ({
          date: new Date(transaction.createdAt),
          description: 'Payment',
          debit: null,
          credit: transaction.debit,
          runningBalance: 0, // Placeholder
          notes: transaction.notes,
        }));

        // Merge and sort by date
        const combinedEntries = [...invoices, ...transactions].sort(
          (a, b) => a.date.getTime() - b.date.getTime()
        );

        // Calculate running balance
        let runningBalance = this.client.openingBalance || 0;
        const unifiedStatement = combinedEntries.map((entry) => {
          if (entry.debit) {
            runningBalance += entry.debit; // Increase balance
          }
          if (entry.credit) {
            runningBalance -= entry.credit; // Decrease balance
          }
          return { ...entry, runningBalance };
        });

        // Add opening balance as the first entry
        this.unifiedStatement = [
          {
            date: new Date(this.client.createdAt),
            description: 'Opening Balance',
            debit: this.client.openingBalance || 0,
            credit: null,
            runningBalance: this.client.openingBalance || 0,
            notes: 'Initial account balance',
          },
          ...unifiedStatement,
        ];

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading client details:', err);
        this.isLoading = false;
      },
    });
  }
}
