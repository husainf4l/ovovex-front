import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-invoice-print',
  templateUrl: './invoice-print.component.html',
  styleUrls: ['./invoice-print.component.css'],
  imports: [CommonModule],
})
export class InvoicePrintComponent {
  @Input() invoiceData: any; // Input data for the invoice
  @Input() companyData: any; // Company details

  printInvoice(): void {
    const printContents =
      document.getElementById('printableInvoice')?.innerHTML;

    if (printContents) {
      const printWindow = window.open('', '', 'width=793,height=1122'); // Adjust for A4 ratio
      const invoiceHtml = `
        <html>
          <head>
            <title>Invoice</title>
            <style>
              /* Reset margin and padding for print */
              body, html {
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
              }

              @page {
                size: A4;
                margin: 20mm; /* Set margins to 20mm for A4 */
              }

              #printableInvoice {
                max-width: 100%;
                overflow: hidden;
              }

              /* Flexbox for centering the content */
              .invoice-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 20px;
              }

              .invoice-header {
                text-align: center;
                width: 100%;
                margin-bottom: 20px;
              }

              .logo-title {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                flex-wrap: wrap;
              }

              .logo {
                width: 150px;
                max-width: 100%;
              }

              .title {
                font-size: 2.5rem;
                font-weight: bold;
              }

              .separator {
                border-top: 2px solid #000;
                margin: 20px 0;
              }

              .invoice-info {
                display: flex;
                justify-content: space-between;
                width: 100%;
                margin-bottom: 20px;
                flex-wrap: wrap;
              }

              .invoice-info div {
                width: 48%;
                font-size: 1rem;
              }

              .invoice-table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
              }

              .invoice-table th, .invoice-table td {
                padding: 12px;
                border: 1px solid #ddd;
                text-align: left;
              }

              .invoice-table th {
                background-color: #f4f4f4;
                font-weight: bold;
              }

              .totals {
                text-align: right;
                width: 100%;
                font-size: 1.1rem;
                margin-top: 20px;
              }

              .totals p {
                margin: 8px 0;
              }

              .grand-total {
                font-size: 1.4rem;
                font-weight: bold;
              }

              .footer {
                width: 100%;
                text-align: left;
                margin-top: 30px;
                font-size: 0.9rem;
              }

              .company-name {
                font-weight: bold;
                margin-bottom: 10px;
              }

              @media print {
                .invoice-container {
                  padding: 10px;
                }

                .footer {
                  font-size: 0.8rem;
                }

                .invoice-info div {
                  width: 45%;
                }

                .invoice-table th, .invoice-table td {
                  font-size: 0.9rem;
                  padding: 8px;
                }
              }
            </style>
          </head>
          <body>
            <div id="printableInvoice" class="invoice-container">
              <div class="invoice-header">
                <div class="logo-title">
                  <img [src]="companyData?.logoImage" alt="Company Logo" class="logo">
                  <p class="title">INVOICE</p>
                </div>
              </div>
              <hr class="separator">

              <div class="invoice-info">
                <div>
                  <p><strong>Customer:</strong> {{ invoiceData?.customerName }}</p>
                  <p><strong>Account Manager:</strong> {{ invoiceData?.accountManagerName }}</p>
                  <p><strong>Payment Mode:</strong> {{ invoiceData?.paymentMode }}</p>
                </div>
                <div>
                  <p><strong>Invoice Date:</strong> {{ invoiceData?.date }}</p>
                  <p><strong>Invoice #:</strong> {{ invoiceData?.invoiceNumber }}</p>
                  <p><strong>Tax Number:</strong> {{ companyData?.taxNumber }}</p>
                </div>
              </div>
              <hr class="separator">

              <table class="invoice-table">
                <thead>
                  <tr>
                    <th>Barcode</th>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let product of invoiceData?.invoiceItems">
                    <td>{{ product.barcode }}</td>
                    <td>{{ product.description }}</td>
                    <td class="text-center">{{ product.quantity }}</td>
                    <td class="text-center">{{ product.salesPrice | currency }}</td>
                    <td class="text-center">{{ product.total | currency }}</td>
                  </tr>
                </tbody>
              </table>
              <hr class="separator">

              <div class="totals">
                <p><strong>Subtotal:</strong> {{ invoiceData?.subtotal | currency }}</p>
                <p><strong>VAT ({{ invoiceData?.taxRate }}%):</strong> {{ invoiceData?.vatAmount | currency }}</p>
                <p class="grand-total"><strong>Grand Total:</strong> {{ invoiceData?.grandTotal | currency }}</p>
              </div>

              <div class="footer">
                <p class="company-name">{{ companyData?.name }}</p>
                <p>Address: {{ companyData?.address }}</p>
                <p>Phone: {{ companyData?.phone }} | Email: {{ companyData?.email }}</p>
              </div>
            </div>
          </body>
        </html>
      `;

      printWindow?.document.write(invoiceHtml);
      printWindow?.document.close();

      printWindow?.addEventListener('load', () => {
        printWindow?.print();
        printWindow?.close();
      });
    } else {
      console.error('Unable to find printable content.');
    }
  }
}
