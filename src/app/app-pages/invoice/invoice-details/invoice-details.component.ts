import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InvoiceService } from '../../../services/invoice.service';
import { CommonModule } from '@angular/common';
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.css'],
  standalone: true,
  imports: [CommonModule, QRCodeComponent], // Import QRCodeComponent
})
export class InvoiceDetailsComponent implements OnInit {
  invoiceId: string | null = null;
  invoiceDetails: any = null;
  companyData: any = {
    name: 'Your Company Name',
    logoImage: '/assets/logo.png',
    taxNumber: '123456789',
    address: '123 Business St, City, Country',
    phone: '+123 456 789',
    email: 'info@yourcompany.com',
  };
  qrCodeUrl: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private invoiceService: InvoiceService
  ) { }

  ngOnInit(): void {
    this.loadCompanyData();
    this.invoiceId = this.route.snapshot.paramMap.get('invoiceId');
    if (this.invoiceId) {
      this.fetchInvoiceDetails(this.invoiceId);
    }
  }

  loadCompanyData() {
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        const company = userData?.userData?.company;

        if (company) {
          this.companyData = {
            name: company.name || 'Default Company Name',
            logoImage: company.logoImage || '/assets/logo.png',
            taxNumber: company.taxNumber || '123456789',
            address: company.address || '123 Business St, City, Country',
            phone: company.phone || '+123 456 789',
            email: company.email || 'info@yourcompany.com',
          };
        }
      } catch (error) {
        console.error('Error parsing userData:', error);
      }
    }
  }

  fetchInvoiceDetails(invoiceId: string) {
    this.invoiceService.getInvoiceDetails(invoiceId).subscribe({
      next: (data) => {
        this.invoiceDetails = data;
        this.generateQRCode();
      },
      error: (err) => {
        console.error('Error fetching invoice details:', err);
      },
    });
  }
  eInvoice() { this.invoiceService.submiteInvoice(this.invoiceDetails).subscribe() }


  generateQRCode() {
    if (this.invoiceId) {
      this.qrCodeUrl = `https://ovovex.com/verify/${this.invoiceId}`;
    }
  }
}
