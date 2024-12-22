import { Component } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { ProductService } from '../../../services/product.service';
import { CreateProductDto } from '../../../models/interfaces.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-upload-excile',
  templateUrl: './upload-excile.component.html',
  styleUrls: ['./upload-excile.component.css'],
  imports:[CommonModule, FormsModule]
})
export class UploadExcileComponent {
  headers: (keyof CreateProductDto)[] = [];
  excelData: CreateProductDto[] = [];
  isLoading: boolean = false;
  parseError: string | null = null;

  constructor(private productService: ProductService) {}

  async onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
  
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const workbook = new ExcelJS.Workbook();
      const arrayBuffer = await file.arrayBuffer();
  
      try {
        await workbook.xlsx.load(arrayBuffer);
        const worksheet = workbook.worksheets[0];
        console.log('Worksheet loaded:', worksheet.name); // Log worksheet name
  
        this.headers = this.getHeaders(worksheet);
        console.log('Parsed Headers:', this.headers); // Log headers
        this.excelData = this.getRows(worksheet);
        console.log('Parsed Excel Data:', this.excelData); // Log rows
      } catch (error) {
        console.error('Error parsing Excel file:', error);
      }
    }
  }
  
  

  getHeaders(worksheet: ExcelJS.Worksheet): (keyof CreateProductDto)[] {
    const headerRow = worksheet.getRow(1);
    if (!headerRow.values || !Array.isArray(headerRow.values)) {
      return [];
    }

    const allowedKeys: (keyof CreateProductDto)[] = [
      'barcode',
      'name',
      'companyId',
      'description',
      'costPrice',
      'salesPrice',
      'wholesalePrice',
      'avgPrice',
      'stock',
      'reorderLevel',
      'isActive',
      'origin',
      'family',
      'subFamily',
      'taxRate',
      'discountRate',
      'profitMargin',
      'location',
      'packaging',
      'category',
      'nrv',
      'itemType',
      'imageUrl',
    ];

    return headerRow.values
      .slice(1)
      .map((header) => (header ? header.toString() : ''))
      .filter((header): header is keyof CreateProductDto =>
        allowedKeys.includes(header as keyof CreateProductDto)
      );
  }

  getRows(worksheet: ExcelJS.Worksheet): CreateProductDto[] {
    const rows: CreateProductDto[] = [];

    worksheet.eachRow((row, rowIndex) => {
      if (rowIndex > 1) {
        const rowValues = Array.isArray(row.values) ? row.values.slice(1) : [];

        const rowData: { [key: string]: any } = {};

        this.headers.forEach((header, index) => {
          if (header && index < rowValues.length) {
            const value = rowValues[index];
            rowData[header] = value !== null && value !== undefined
              ? String(value)
              : undefined;
          }
        });

        rows.push(rowData as CreateProductDto);
      }
    });

    return rows;
  }

  submitData() {
    if (this.excelData.length === 0) {
      console.error('No data to submit!');
      return;
    }

    this.isLoading = true;

    this.productService.bulkUpload(this.excelData).subscribe(
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
