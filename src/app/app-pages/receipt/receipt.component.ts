import { Component, OnInit } from '@angular/core';
import { SearchInputComponent } from "../../components/shared/search-input/search-input.component";
import { DropdownComponent } from "../../components/shared/dropdown/dropdown.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InvoiceService } from '../../services/invoice.service';
import { ReceiptService } from '../../services/receipt.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css'],
  imports: [SearchInputComponent, DropdownComponent, CommonModule, FormsModule, MatIcon],
})
export class ReceiptComponent implements OnInit {
  clients: any = []; // Array of clients
  accountManagers: any = []; // Array of account managers
  cashAccounts: any = []; // Array of cash accounts
  cheques: any = [{
    number: 0
  }]; // List of cheques for CHEQUE payment mode

  receiptNumber: number = 0;
  paymentMode: string = 'CASH'; // Default payment mode
  selectedClient: any = null;
  selectedAccountManager: any = null;
  selectedCashAccount: any = null;

  constructor(private receiptService: ReceiptService) { }

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

  /**
   * Remove a cheque from the list by index.
   */
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

  }

  printReceipt() {
    console.log('Printing receipt...');
  }
}
