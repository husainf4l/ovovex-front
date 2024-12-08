import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../../../components/shared/table/table.component';
import { SearchInputComponent } from '../../../components/shared/search-input/search-input.component';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  imports: [TableComponent, SearchInputComponent, CommonModule],
})
export class InvoiceListComponent implements OnInit {
  accounts = [
    { id: '1', name: 'Account A' },
    { id: '2', name: 'Account B' },
    { id: '3', name: 'Account C' },
  ];

  invoices = [
    { invoiceNumber: 'INV001', clientName: 'John Doe', totalAmount: 500, date: '2024-12-01', accountId: '1', id: '12345' },
    { invoiceNumber: 'INV002', clientName: 'Jane Smith', totalAmount: 300, date: '2024-12-02', accountId: '2', id: '12346' },
    { invoiceNumber: 'INV003', clientName: 'Sam Johnson', totalAmount: 450, date: '2024-12-03', accountId: '3', id: '12347' },
  ];

  filteredInvoices = [...this.invoices];

  constructor(private router: Router
  ) { }

  ngOnInit() {
    // Initialize filteredInvoices to show all invoices initially
    this.filteredInvoices = [...this.invoices];
  }

  onAccountSelected(account: any) {
    // Filter invoices based on the selected account
    if (account) {
      this.filteredInvoices = this.invoices.filter((invoice) => invoice.accountId === account.id);
    } else {
      this.filteredInvoices = [...this.invoices]; // Show all invoices if no account is selected
    }
  }

  onInvoiceClicked(invoice: any) {
    this.router.navigate(['/invoice-details', invoice.id]);
  }
}
