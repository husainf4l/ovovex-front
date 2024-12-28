import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AccountManager, Client, InvoiceProduct, Product } from '../../models/interfaces.model';
import { InvoiceService } from '../../services/invoice.service';
import { AddCustomerDialogComponent } from '../../components/dialogs/add-customer-dialog/add-customer-dialog.component';
import { InvoicePrintComponent } from '../../components/print/invoice-print/invoice-print.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TotalsComponent } from "../../components/shared/totals/totals.component";
import { SearchInputComponent } from "../../components/shared/search-input/search-input.component";
import { DropdownComponent } from "../../components/shared/dropdown/dropdown.component";
import { DateSelectorComponent } from "../../components/shared/date-selector/date-selector.component";

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css'],
  imports: [CommonModule, FormsModule, TotalsComponent, SearchInputComponent, DropdownComponent, DateSelectorComponent],
})
export class InvoiceComponent implements OnInit {
  @ViewChild(InvoicePrintComponent) invoicePrintComponent!: InvoicePrintComponent;

  clients: Client[] = [];
  filteredClients: Client[] = [];
  products: Product[] = [];
  invoiceProducts: InvoiceProduct[] = [];
  accountManagers: AccountManager[] = [];
  cashAccounts: any[] = [];
  selectedClient: Client | null = null;
  selectedAccountManager: AccountManager | null = null;
  selectedCashAccountId: string = '';
  number: number = 0;
  taxRate: number = 16;
  subtotal: number = 0;
  vatAmount: number = 0;
  grandTotal: number = 0;
  invoiceDate: string = new Date().toISOString();
  InvoiceTypeCodeName: any = '012';
  searchQuery: string = '';
  productSearchQuery: string = '';
  accountManagerSearchQuery: string = '';
  userData: any;

  constructor(private dialog: MatDialog, private invoiceService: InvoiceService) { }

  ngOnInit(): void {
    this.loadUserData();
    this.fetchInitialData();
  }

  private loadUserData(): void {
    try {
      const userDataString = localStorage.getItem('userData');
      if (userDataString) {
        this.userData = JSON.parse(userDataString);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }

  private fetchInitialData(): void {
    this.invoiceService.getInvoiceData().subscribe({
      next: (data) => {
        this.clients = data.clients;
        this.products = data.products;
        this.accountManagers = data.accountManagers;
        this.cashAccounts = data.cashAccounts.map((account: any) => ({
          value: account.id,
          label: account.name,
        }));
        this.number = data.number;
      },
      error: (err) => {
        console.error('Error fetching invoice data:', err);
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
    this.products = this.products.filter(
      (product) =>
        product.name?.toLowerCase().includes(query) ||
        product.barcode.includes(query)
    );
  }

  addProductToInvoice(product: Product): void {
    const existingProduct = this.invoiceProducts.find((p) => p.id === product.id);
    if (existingProduct) {
      existingProduct.quantity += 1; // Increment quantity if product already exists
      existingProduct.total = existingProduct.quantity * existingProduct.salesPrice;
    } else {
      this.invoiceProducts.push({
        id: product.id,
        barcode: product.barcode,
        name: product.name,
        quantity: 1,
        salesPrice: product.salesPrice,
        total: product.salesPrice,
      });
    }
    this.updateTotals(); // Update totals after adding a product
  }
  updateProductQuantity(product: InvoiceProduct): void {
    product.total = product.quantity * product.salesPrice; // Update total for the product
    this.updateTotals(); // Recalculate totals for the invoice
  }

  removeProduct(id: string): void {
    this.invoiceProducts = this.invoiceProducts.filter((product) => product.id !== id);
    this.updateTotals(); // Recalculate totals after removing the product
  }



  updateTotals(): void {
    this.subtotal = this.invoiceProducts.reduce((sum, item) => sum + item.total, 0);
    this.vatAmount = (this.subtotal * this.taxRate) / 100;
    this.grandTotal = this.subtotal + this.vatAmount;
  }

  saveInvoice(): void {
    if (!this.selectedClient || !this.invoiceProducts.length) {
      alert('Please complete all required fields before saving the invoice.');
      return;
    }

    const invoiceData = {
      clientId: this.selectedClient.id,
      clientName: this.selectedClient.name,
      accountManagerId: this.selectedAccountManager?.id,
      issueDate: this.invoiceDate,
      number: this.number,
      cashAccountId: this.selectedCashAccountId,
      items: this.invoiceProducts.map((product) => ({
        name: product.name,
        productId: product.id,
        quantity: product.quantity,
        unitPrice: product.salesPrice,
        totalAmount: product.total,
      })),
      taxExclusiveAmount: this.subtotal,
      taxAmount: this.vatAmount,
      taxInclusiveAmount: this.grandTotal,
    };

    this.invoiceService.createInvoice(invoiceData).subscribe({
      next: () => {
        alert('Invoice saved successfully.');
        window.location.reload();
      },
      error: (err) => {
        console.error('Error saving invoice:', err);
        alert('Failed to save the invoice.');
      },
    });
  }

  openAddCustomerDialog(): void {
    const dialogRef = this.dialog.open(AddCustomerDialogComponent, {
      width: '400px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Assuming the result contains the added customer
        this.clients.push(result.client.account);
        this.selectClient(result.client.account);
      }
    });
  }
  selectAccountManager(accountManager: AccountManager): void {
    this.selectedAccountManager = accountManager;
    this.accountManagerSearchQuery = accountManager.name; // Update search input for account managers
  }


  printInvoice(): void {
    this.invoicePrintComponent.printInvoice();
  }
}
