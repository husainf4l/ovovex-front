import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-invoice-print',
  templateUrl: './invoice-print.component.html',
  styleUrls: ['./invoice-print.component.css'],
  imports: [CommonModule]
})
export class InvoicePrintComponent {
  @Input() invoiceData: any; // Input data for the invoice
  @Input() companyData: any; // Company details


  printInvoice(): void {
    const printContents = document.getElementById('printableInvoice')?.innerHTML;

    if (printContents) {
      const printWindow = window.open('', '', 'width=793,height=1122'); // Adjust for A4 ratio
      const invoiceHtml = `
        <html>
          <head>
            <title>Invoice</title>
            <style>
              /* A4 size and zero margin */
            @page {
    size: A4; /* Ensure A4 size */
    margin: 0; /* Remove default margins */
  }

#printableInvoice {
    font-family: Arial, sans-serif;
    margin: 10px;
}

.invoice-container {
    padding: 10px;
}

.invoice-header {
    text-align: center;
    margin-bottom: 20px;
}

.logo-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    width: 180px;
}

.title {
    font-size: 2em;
    font-weight: bold;
}

.separator {
    border: 1px solid #000;
    margin: 20px 0;
}

.invoice-info {
    display: flex;
    justify-content: space-between;
    font-size: 0.9em;
    margin-bottom: 20px;
}

.invoice-info div {
    width: 45%;
}

.invoice-table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
}

.invoice-table th, .invoice-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}

.invoice-table th {
    background-color: #f4f4f4;
    font-weight: bold;
}

.totals {
    text-align: right;
    font-size: 0.9em;
}

.totals p {
    margin: 5px 0;
}

.grand-total {
    font-size: 1.2em;
    font-weight: bold;
}

.footer {
    margin-top: 20px;
    font-size: 0.8em;
    text-align: left;
}

.footer .company-name {
    font-weight: bold;
    margin-bottom: 5px;
}

            </style>
          </head>
          <body>
            <div class="invoice-container">${printContents}</div>
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