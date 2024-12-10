import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InvoiceService } from '../../../services/invoice.service';
import { TableComponent } from '../../../components/shared/table/table.component';
import { SearchInputComponent } from '../../../components/shared/search-input/search-input.component';
import { CommonModule } from '@angular/common';
import { Invoice, Customer } from '../../../models/interfaces.model'; // Import your interfaces

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css'],
  imports: [TableComponent, SearchInputComponent, CommonModule],
})
export class InvoiceListComponent implements OnInit {
  invoices: Invoice[] = [];
  filteredInvoices: Invoice[] = [];
  accounts: Customer[] = []; // Define Customer type
  columns: { label: string; key: string }[] = [
    { label: 'Invoice Number', key: 'invoiceNumber' },
    { label: 'Client Name', key: 'customerName' },
    { label: 'Total Amount', key: 'total' },
    { label: 'Date', key: 'date' },
  ];

  constructor(private router: Router, private invoiceService: InvoiceService) {}

  ngOnInit() {
    this.invoiceService.getInvoicesDetails().subscribe((data: Invoice[]) => {
      // Add a new property called 'customerName' to each invoice
      this.invoices = data.map((invoice) => ({
        ...invoice,
        customerName: invoice.customer ? invoice.customer.name : 'Unknown', // Add customer name to the invoice object
      }));

      this.filteredInvoices = [...this.invoices]; // Initialize filteredInvoices with the invoices
      this.accounts = data.map((invoice) => invoice.customer); // Extract customer from each invoice
    });
  }

  onAccountSelected(account: Customer) {
    // Filter invoices based on the selected account
    if (account) {
      this.filteredInvoices = this.invoices.filter(
        (invoice) => invoice.customer.id === account.id
      );
    } else {
      this.filteredInvoices = [...this.invoices]; // Show all invoices if no account is selected
    }
  }

  onInvoiceClicked(invoice: Invoice) {
    this.router.navigate(['/app/invoice/invoice-details', invoice.id]);
  }
}
