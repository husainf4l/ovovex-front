import { Injectable } from '@angular/core';
import { Product } from '../models/purchase.model';
import { InvoiceProduct } from '../models/interfaces.model';

@Injectable({
  providedIn: 'root',
})
export class PrintService {
  constructor() {}
  printInvoice(invoiceId: string, companyData: any, invoiceDetails: any): void {
    if (invoiceDetails && invoiceDetails.items.length > 0) {
      const printWindow = window.open('', '', 'width=793,height=1122'); // Adjust for A4 ratio
  
      // Define invoice HTML content
      const invoiceHtml = `
        <html>
          <head>
            <title>Invoice</title>
            <style>
              @page { size: A4; margin: 0; }
              #printableInvoice { font-family: Arial, sans-serif; }
              .invoice-container { padding: 10px; }
              .invoice-header { text-align: center; margin-bottom: 20px; }
              .logo-title { display: flex; justify-content: space-between; align-items: center; }
              .logo { width: 100px; height: auto; margin-right: 15px; }
              .title { font-size: 2em; font-weight: bold; }
              .separator { border: 1px solid #000; margin: 20px 0; }
              .invoice-info { display: flex; justify-content: space-between; font-size: 0.9em; margin-bottom: 20px; }
              .invoice-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              .invoice-table th, .invoice-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              .invoice-table th { background-color: #f4f4f4; font-weight: bold; }
              .totals { text-align: right; font-size: 0.9em; }
              .footer { position: fixed; bottom: 0; left: 0; width: 100%; padding: 10px 20px; background-color: #f1f1f1; font-size: 0.8em; text-align: left; }
              .footer .company-name { font-weight: bold; margin-bottom: 5px;}
              .footer p { margin: 0; padding: 0; }
            </style>
          </head>
          <body>
            <div class="invoice-container">
              <div class="invoice-header">
                <div class="logo-title">
                  <img src="${companyData?.logoImage}" alt="Company Logo" class="logo" />
                  <p class="title">INVOICE</p>
                </div>
              </div>
              <hr class="separator" />
              <div class="invoice-info">
                <div>
                  <p><strong>Customer:</strong> ${invoiceDetails?.customer?.name}</p>
                  <p><strong>Account Manager:</strong> ${invoiceDetails?.employee?.name}</p>
                  <p><strong>Payment Mode:</strong> ${invoiceDetails?.InvoiceTypeCodeName === '011' ? 'CASH INVOICE' : 'RECEIVABLE INVOICE'}</p>
                </div>
                <div>
                  <p><strong>Invoice Date:</strong> ${invoiceDetails?.issueDate}</p>
                  <p><strong>Invoice #:</strong> ${invoiceDetails?.number}</p>
                  <p><strong>Tax Number:</strong> ${companyData?.taxNumber}</p>
                </div>
              </div>
              <hr class="separator" />
              <table class="invoice-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th class="text-center">Quantity</th>
                    <th class="text-center">Unit Price</th>
                    <th>Tax Percent</th>
                    <th>Discount</th>
                    <th class="text-center">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${invoiceDetails?.items.map(
                    (product: InvoiceProduct) => `
                      <tr>
                        <td>${product.name}</td>
                        <td class="text-center">${product.quantity}</td>
                        <td class="text-center">${product.salesPrice}</td>
                        <td>${product.taxPercent}</td>
                        <td>${product.discountAmount}</td>
                        <td class="text-center">${product.lineExtensionAmount}</td>
                      </tr>`
                  ).join('')}
                </tbody>
              </table>
              <div class="totals">
                <p><strong>Tax Exclusive Amount:</strong> ${invoiceDetails?.taxExclusiveAmount}</p>
                <p><strong>Tax Amount:</strong> ${invoiceDetails?.taxInclusiveAmount - invoiceDetails?.taxExclusiveAmount}</p>
                <p><strong>Tax Inclusive Amount:</strong> ${invoiceDetails?.taxInclusiveAmount}</p>
              </div>
            </div>
            <div class="footer">
              <p class="company-name">${companyData?.name}</p>
              <p>Address: ${companyData?.address}</p>
              <p>Phone: ${companyData?.phone} | Email: ${companyData?.email}</p>
            </div>
          </body>
        </html>
      `;
  
      printWindow?.document.write(invoiceHtml);
      printWindow?.document.close();
  
      printWindow?.addEventListener('load', () => {
        // Wait for content to fully load before printing
        setTimeout(() => {
          printWindow?.print(); // Trigger print dialog
          printWindow?.close(); // Close the print window after printing
        }, 1000); // Adding delay to ensure proper content load
      });
    } else {
      console.error('Unable to find printable content.');
    }
  }
  
  
}
