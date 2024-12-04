import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddCustomerDialogComponent } from '../../dialogs/add-customer-dialog/add-customer-dialog.component';
import { Client, InvoiceItem, Item } from '../../models/interfaces.model';
import { ProductsService } from '../../services/products.service';
import { ClientsService } from '../../services/clients.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css'],
  imports: [FormsModule, CommonModule]
})
export class InvoiceComponent implements OnInit {

  constructor(private dialog: MatDialog, private productsService: ProductsService, private clientsService: ClientsService) { }

  ngOnInit(): void {
    this.fetchClients();
    this.fetchItems();
  }

  openAddCustomerDialog(): void {
    const dialogRef = this.dialog.open(AddCustomerDialogComponent, {
      width: '400px',
      disableClose: true, // Prevent closing the dialog by clicking outside
      data: {} // Pass any data if needed
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Customer added:', result);

        // Add the new client to the clients list
        this.clients.push(result.client.account);

        // Set the new client as the selected client
        this.selectClient(result.client.account);
      }
    });
  }


  clients: Client[] = [];
  filteredClients: Client[] = [...this.clients]; // Copy for filtering
  selectedClient: Client | null = null; // Selected client
  searchQuery: string = ''; // Search input

  items: Item[] = [];


  fetchItems(): void {

    this.productsService.getInvoiceProducts().subscribe({
      next: (data) => {
        this.items = data;

      },
      error: (err) => {
        console.error('Error fetching accounts:', err);

      },
    });
  }

  fetchClients(): void {

    this.clientsService.getIvoiceClients().subscribe({
      next: (data) => {
        this.clients = data;

      },
      error: (err) => {
        console.error('Error fetching accounts:', err);

      },
    });
  }


  filteredItems: Item[] = [...this.items];
  itemSearchQuery: string = '';

  bonus = 0;

  accountManager = '';
  paymentMode = 'Cash';

  customerName: string = '';
  invoiceDate: string = new Date().toISOString().split('T')[0];
  invoiceNumber: string = `INV-${Math.floor(Math.random() * 1000000)}`;
  taxRate = 16;
  invoiceItems: InvoiceItem[] = [];
  subtotal: number = 0;
  vatAmount: number = 0;
  grandTotal: number = 0;



  filterClients(): void {
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredClients = this.clients.filter((client) =>
      client.name.toLowerCase().includes(query)
    );
  }

  selectClient(client: Client): void {
    this.selectedClient = client;
    this.searchQuery = client.name; // Set search box to the selected name
    this.filteredClients = []; // Clear dropdown
  }

  filterItems(): void {
    this.filteredItems = this.items.filter(
      (item) =>
        item.name.toLowerCase().includes(this.itemSearchQuery.toLowerCase()) ||
        item.barcode.includes(this.itemSearchQuery)
    );
  }
  selectItem(item: Item): void {
    this.invoiceItems.push({
      id: Math.random().toString(36).substring(2),
      barcode: item.barcode,
      description: item.name,
      quantity: 1,
      salesPrice: item.salesPrice,
      total: item.salesPrice,
    });
    this.itemSearchQuery = '';
    this.filteredItems = [];
    this.updateTotals();
  }

  removeItem(id: string): void {
    this.invoiceItems = this.invoiceItems.filter((item) => item.id !== id);
    this.updateTotals();
  }

  updateTotal(item: InvoiceItem): void {
    item.total = item.quantity * item.salesPrice;
    this.updateTotals();
  }

  updateTotals(): void {
    this.subtotal = this.invoiceItems.reduce((sum, item) => sum + item.total, 0);
    this.vatAmount = (this.subtotal * this.taxRate) / 100;
    this.grandTotal = this.subtotal + this.vatAmount;
  }

  saveInvoice(): void {
    console.log('Invoice saved:', {
      customer: this.selectedClient,
      accountManager: this.accountManager,
      date: this.invoiceDate,
      items: this.invoiceItems,
      total: this.grandTotal,
      paymentMode: this.paymentMode,
    });
  }



  printInvoice(): void {
    const printContents = document.getElementById('printableInvoice')?.innerHTML;
    if (printContents) {
      const printWindow = window.open('', '', 'width=800,height=600');
      printWindow?.document.write(`
            <html>
                <head>
                    <title>Invoice</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                        th, td { padding: 8px; border: 1px solid #ddd; text-align: left; }
                        th { background-color: #f4f4f4; }
                        .text-right { text-align: right; }
                    </style>
                </head>
                <body>${printContents}</body>
            </html>
        `);
      printWindow?.document.close();
      printWindow?.print();
    }
  }

}
