import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  accountManagers,
  Client,
  InvoiceProduct,
  Product,
} from '../../models/interfaces.model';
import { InvoiceService } from '../../services/invoice.service';
import { AddCustomerDialogComponent } from '../../components/dialogs/add-customer-dialog/add-customer-dialog.component';
import { InvoicePrintComponent } from '../../components/print/invoice-print/invoice-print.component';
import { SearchInputComponent } from '../../components/shared/search-input/search-input.component';
import { DropdownComponent } from '../../components/shared/dropdown/dropdown.component';
import { TableComponent } from '../../components/shared/table/table.component';
import { TotalsComponent } from '../../components/shared/totals/totals.component';
import { DateSelectorComponent } from '../../components/shared/date-selector/date-selector.component';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css'],
  imports: [
    FormsModule,
    CommonModule,
    InvoicePrintComponent,
    SearchInputComponent,
    DropdownComponent,
    TotalsComponent,
    DateSelectorComponent,
    TableComponent,
  ],
})
export class InvoiceComponent implements OnInit {
  @ViewChild(InvoicePrintComponent)
  invoicePrintComponent!: InvoicePrintComponent; // Declare ViewChild

  clients: Client[] = [];
  filteredClients: Client[] = [];
  selectedClient: Client | null = null;
  searchQuery: string = '';
  products: Product[] = [];
  filteredProducts: Product[] = [];
  productSearchQuery: string = '';
  accountManagers: accountManagers[] = [];
  filteredAccountManagers: accountManagers[] = [];
  selectedAccountManager: accountManagers | null = null;
  accountManagerSearchQuery: string = '';
  invoiceProducts: InvoiceProduct[] = [];
  subtotal: number = 0;
  vatAmount: number = 0;
  grandTotal: number = 0;
  taxRate: number = 16;
  bonus: number = 0;
  paymentMode: string = 'CASH';
  customerName: string = '';
  invoiceDate: string = new Date().toISOString();
  invoiceNumber: number = 0;
  userData: any;

  constructor(
    private dialog: MatDialog,
    private invoiceService: InvoiceService
  ) {}

  ngOnInit(): void {
    this.fetchData();
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      try {
        this.userData = JSON.parse(userDataString);
      } catch (error) {
        console.error('Error parsing userData:', error);
      }
    }
  }

  fetchData(): void {
    this.invoiceService.getInvoiceData().subscribe({
      next: (data) => {
        this.products = data.products;
        this.clients = data.clients;
        this.accountManagers = data.accountManagers;
        this.filteredClients = [...this.clients];
        this.filteredProducts = [...this.products];
        this.filteredAccountManagers = [...this.accountManagers];
        this.invoiceNumber = data.invoiceNumber;
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      },
    });
  }

  filterClients(): void {
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredClients = this.clients.filter((client) =>
      client.name?.toLowerCase().includes(query)
    );
  }

  selectClient(client: Client): void {
    this.selectedClient = client;
    this.searchQuery = client.name;
    this.filteredClients = [];
  }

  filterProducts(): void {
    const query = this.productSearchQuery.toLowerCase().trim();
    this.filteredProducts = this.products.filter(
      (product) =>
        product.name?.toLowerCase().includes(query) ||
        product.barcode.includes(query)
    );
  }

  selectProduct(product: Product): void {
    this.invoiceProducts.push({
      id: product.id,
      barcode: product.barcode,
      description: product.name,
      quantity: 1,
      salesPrice: product.salesPrice,
      total: product.salesPrice,
    });
    this.productSearchQuery = '';
    this.filteredProducts = [];
    this.updateTotals();
  }

  removeProduct(id: string): void {
    this.invoiceProducts = this.invoiceProducts.filter(
      (product) => product.id !== id
    );
    this.updateTotals();
  }

  updateTotal(product: InvoiceProduct): void {
    product.total = product.quantity * product.salesPrice;
    this.updateTotals();
  }

  updateTotals(): void {
    this.subtotal = this.invoiceProducts.reduce(
      (sum, product) => sum + product.total,
      0
    );
    this.vatAmount = (this.subtotal * this.taxRate) / 100;
    this.grandTotal = this.subtotal + this.vatAmount;
  }

  filterAccountManagers(): void {
    const query = this.accountManagerSearchQuery.toLowerCase().trim();
    this.filteredAccountManagers = this.accountManagers.filter(
      (manager) =>
        manager.displayName.toLowerCase().includes(query) ||
        manager.id.includes(query)
    );
  }

  selectAccountManager(accountManager: accountManagers): void {
    this.selectedAccountManager = accountManager;
    this.accountManagerSearchQuery = accountManager.displayName;
    this.filteredAccountManagers = [];
  }

  openAddCustomerDialog(): void {
    const dialogRef = this.dialog.open(AddCustomerDialogComponent, {
      width: '400px',
      disableClose: true,
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Customer added:', result);
        this.clients.push(result.client.account);
        this.selectClient(result.client.account);
      }
    });
  }

  saveInvoice(): void {
    if (!this.selectedClient || this.invoiceProducts.length === 0) {
      alert('Please complete all required fields before saving the invoice.');
      return;
    }

    const invoiceData = {
      clientId: this.selectedClient.id,
      clientName: this.selectedClient.name,
      accountManagerId: this.selectedAccountManager?.id,
      date: this.invoiceDate,
      invoiceNumber: this.invoiceNumber,
      invoiceItems: this.invoiceProducts.map((product) => ({
        productId: product.id,
        quantity: product.quantity,
        unitPrice: product.salesPrice,
        taxAmount: 16,
        discount: 0,
        totalAmount: product.total,
      })),
      total: this.subtotal,
      taxAmount: this.vatAmount,
      grandTotal: this.grandTotal,
      paymentMode: this.paymentMode,
      bonus: this.bonus,
    };

    this.invoiceService.createInvoice(invoiceData).subscribe({
      next: (response) => {
        console.log('Invoice submitted successfully:', response);
        alert('Invoice saved successfully.');
        // Optionally clear the form or navigate to another page
        window.location.reload();
      },
      error: (err) => {
        console.error('Error saving invoice:', err);
        alert('Failed to save the invoice. Please try again.');
      },
    });
  }

  printInvoice(): void {
    this.invoicePrintComponent.printInvoice();
  }
}
