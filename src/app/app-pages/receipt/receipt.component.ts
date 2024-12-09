import { Component, OnInit } from '@angular/core';
import { SearchInputComponent } from "../../components/shared/search-input/search-input.component";
import { DropdownComponent } from "../../components/shared/dropdown/dropdown.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReceiptService } from '../../services/receipt.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css'],
  imports: [SearchInputComponent, DropdownComponent, CommonModule, FormsModule, MatIconModule],
})
export class ReceiptComponent implements OnInit {
  clients: any = []; // Array of clients
  accountManagers: any = []; // Array of account managers
  cashAccounts: any = []; // Array of cash accounts
  cheques: any = []; // List of cheques for CHEQUE payment mode

  receiptNumber: number = 0;
  paymentMode: string = 'CASH'; // Default payment mode
  selectedClient: any = null;
  selectedAccountManager: any = null;
  selectedCashAccount: any = null;

  constructor(private receiptService: ReceiptService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.receiptService.getReceiptData().subscribe({
      next: (data) => {
        this.clients = data.clients;
        this.accountManagers = data.accountManagers;
        this.cashAccounts = data.cashAccounts;
        this.receiptNumber = data.receiptNumber;
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      },
    });
  }

  selectClient(client: any) {
    this.selectedClient = client;
  }

  selectAccountManager(manager: any) {
    this.selectedAccountManager = manager;
  }

  selectCashAccount(account: any) {
    this.selectedCashAccount = account;
  }

  updatePaymentMode() {
    if (this.paymentMode === 'CHEQUE') {
      this.cheques = []; // Reset cheque list
    }
  }

  addCheque() {
    const newCheque = {
      number: '',
      bankName: '',
      date: '',
      amount: 0,
    };
    this.cheques.push(newCheque);
  }

  removeCheque(index: number) {
    this.cheques.splice(index, 1);
  }

  saveReceipt() {
    const receiptData = {
      client: this.selectedClient,
      accountManager: this.selectedAccountManager,
      paymentMode: this.paymentMode,
      cashAccount: this.selectedCashAccount,
      cheques: this.cheques,
      receiptNumber: this.receiptNumber,
    };

    console.log('Receipt Data:', receiptData);
    // Call service to save the receipt
  }


  printReceipt(): void {
    const printContents = document.getElementById('printableReceipt')?.innerHTML;
    const printWindow = window.open('', '_blank', 'width=300,height=600');
  
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Receipt</title>
            <style>
              /* Thermal Printer Styles */
              body {
                font-family: Arial, sans-serif;
                width: 70mm;
                margin: 0;
                padding: 10px;
              }
              .receipt-header {
                text-align: center;
                font-size: 16px;
                font-weight: bold;
              }
              .receipt-info {
                margin-bottom: 10px;
              }
              .receipt-table {
                width: 100%;
                border-collapse: collapse;
              }
              .receipt-table th, .receipt-table td {
                text-align: left;
                font-size: 14px;
                padding: 5px 0;
                border-bottom: 1px dashed #000;
              }
              .receipt-total {
                margin-top: 10px;
                font-size: 14px;
                font-weight: bold;
              }
            </style>
          </head>
          <body>
            ${printContents || ''}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
      printWindow.close();
    }
  }
  
}