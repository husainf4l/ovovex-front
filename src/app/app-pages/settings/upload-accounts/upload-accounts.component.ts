import { Component } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { AccountService } from '../../../services/account.service';
import {
  BankDetailsDto,
  CreateAccountDto,
} from '../../../models/interfaces.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-upload-accounts',
  templateUrl: './upload-accounts.component.html',
  styleUrls: ['./upload-accounts.component.css'],
  imports: [CommonModule, FormsModule],
})
export class UploadAccountsComponent {
  headers: string[] = [];
  excelData: CreateAccountDto[] = [];
  isLoading: boolean = false;
  parseError: string | null = null;
  accountTypes: string[] = [
    'ASSET',
    'LIABILITY',
    'EQUITY',
    'REVENUE',
    'EXPENSE',
    'TRADEEXPENSES',
  ];

  constructor(private accountService: AccountService) {}

  async onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];
      const workbook = new ExcelJS.Workbook();
      const arrayBuffer = await file.arrayBuffer();

      try {
        await workbook.xlsx.load(arrayBuffer);
        const worksheet = workbook.worksheets[0];

        this.headers = this.getHeaders(worksheet);
        this.excelData = this.getRows(worksheet);
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        this.parseError =
          'Failed to parse the Excel file. Please check its format.';
      }
    }
  }

  getHeaders(worksheet: ExcelJS.Worksheet): string[] {
    const headerRow = worksheet.getRow(1);
    if (!headerRow.values || !Array.isArray(headerRow.values)) {
      return [];
    }

    return headerRow.values
      .slice(1)
      .map((header) => (header ? header.toString().trim() : ''));
  }
  getRows(worksheet: ExcelJS.Worksheet): CreateAccountDto[] {
    const rows: CreateAccountDto[] = [];
  
    worksheet.eachRow((row, rowIndex) => {
      if (rowIndex > 1) {
        // Skip header row
        const rowValues = Array.isArray(row.values) ? row.values.slice(1) : [];
        const rowData: { [key: string]: string | undefined } = {};
  
        this.headers.forEach((header, index) => {
          if (header && index < rowValues.length) {
            const value = rowValues[index];
            rowData[header] =
              value !== null && value !== undefined
                ? String(value).trim()
                : undefined;
          }
        });
  
        const account: CreateAccountDto = {
          hierarchyCode: rowData['hierarchyCode'] || '',
          name: rowData['name'] || '',
          companyId: rowData['companyId'] || '',
          accountType:
            (rowData['accountType'] as CreateAccountDto['accountType']) || 'ASSET',
          parentAccountId: rowData['parentAccountId'] || undefined,
          openingBalance: rowData['openingBalance']
            ? parseFloat(rowData['openingBalance'])
            : undefined,
          currentBalance: rowData['currentBalance']
            ? parseFloat(rowData['currentBalance'])
            : 0,
          mainAccount: rowData['mainAccount'] === 'true',
          bankDetails: rowData['bankName'] || rowData['accountNumber'] // Initialize only if relevant fields exist
            ? {
                bankName: rowData['bankName'] || '',
                accountNumber: rowData['accountNumber'] || '',
                companyId: rowData['companyId'] || 'd6663167-e873-4ab3-87de-6ec72595005d',
              }
            : undefined,
          customerDetails: rowData['customerName'] || rowData['customerPhone'] || rowData['customerEmail'] || rowData['customerAddress'] // Initialize only if relevant fields exist
            ? {
                name: rowData['customerName'] || '',
                phone: rowData['customerPhone'] || '',
                email: rowData['customerEmail'] || '',
                address: rowData['customerAddress'] || '',
              }
            : undefined,
        };
  
        rows.push(account);
      }
    });
  
    return rows;
  }
  
  updateBankDetails(
    index: number,
    field: keyof BankDetailsDto,
    event: Event
  ): void {
    const input = event.target as HTMLInputElement; // Cast to HTMLInputElement
    const value = input?.value || '';

    // Ensure bankDetails is initialized
    if (!this.excelData[index].bankDetails) {
      this.excelData[index].bankDetails = {
        bankName: '',
        accountNumber: '',
        companyId: 'd6663167-e873-4ab3-87de-6ec72595005d',
      };
    }

    // Update the specific field
    this.excelData[index].bankDetails[field] = value;
  }

  submitData() {
    if (this.excelData.length === 0) {
      console.error('No data to submit!');
      return;
    }

    this.isLoading = true;

    this.accountService.bulkUpload(this.excelData).subscribe(
      (response) => {
        console.log('Data uploaded successfully:', response);
        this.excelData = [];
        this.headers = [];
      },
      (error) => {
        console.error('Error uploading data:', error);
      },
      () => {
        this.isLoading = false;
      }
    );
  }
}
