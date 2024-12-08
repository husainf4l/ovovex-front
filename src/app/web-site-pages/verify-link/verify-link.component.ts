import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InvoiceService } from '../../services/invoice.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify-link',
  templateUrl: './verify-link.component.html',
  styleUrls: ['./verify-link.component.css'],
  imports: [CommonModule]
})
export class VerifyLinkComponent implements OnInit {
  verificationId: string | null = null;
  invoiceDetails: any = null;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private invoiceService: InvoiceService
  ) { }

  ngOnInit(): void {
    // Extract the 'id' parameter from the route
    this.verificationId = this.route.snapshot.paramMap.get('id');
    if (this.verificationId) {
      this.fetchInvoiceDetails(this.verificationId);
    } else {
      this.errorMessage = 'No verification ID provided in the URL.';
    }
  }

  fetchInvoiceDetails(invoiceId: string) {
    this.invoiceService.getInvoiceDetails(invoiceId).subscribe({
      next: (data) => {
        this.invoiceDetails = data;
        this.errorMessage = null;
      },
      error: () => {
        this.invoiceDetails = null;
        this.errorMessage = 'The invoice does not exist or could not be verified.';
      },
    });
  }
}
