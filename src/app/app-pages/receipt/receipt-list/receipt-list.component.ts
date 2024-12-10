import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReceiptService } from '../../../services/receipt.service';
import { TableComponent } from '../../../components/shared/table/table.component';

interface ReceiptData {
  id: string;
  customer: { name: string; id: string };
  receiptNumber: number;
  date: string;
  paymentMode: string;
  totalAmount: number;
  notes: string;
}

@Component({
  selector: 'app-receipt-list',
  templateUrl: './receipt-list.component.html',
  styleUrls: ['./receipt-list.component.css'],
  imports: [TableComponent],
})
export class ReceiptListComponent implements OnInit {
  receiptList: ReceiptData[] = [];

  constructor(private receiptService: ReceiptService, private router: Router) {}

  ngOnInit(): void {
    this.getReceipts();
  }

  getReceipts(): void {
    this.receiptService.getReceiptList().subscribe((data) => {
      this.receiptList = data;
    });
  }

  columns: { label: string; key: string }[] = [
    { label: 'Receipt Number', key: 'receiptNumber' },
    { label: 'Date', key: 'date' },
    { label: 'Client Name', key: 'customerId' },
    { label: 'Payment Mode', key: 'paymentMode' },
    { label: 'Total Amount', key: 'totalAmount' },
    { label: 'Notes', key: 'notes' },
  ];

  onInvoiceClicked(receipt: ReceiptData) {
    this.router.navigate(['/app/invoice/invoice-details', receipt.id]);
  }
}
