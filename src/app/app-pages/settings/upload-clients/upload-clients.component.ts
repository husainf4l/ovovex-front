import { Component } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientsService } from '../../../services/clients.service';

@Component({
  selector: 'app-upload-clients',
  templateUrl: './upload-clients.component.html',
  styleUrls: ['./upload-clients.component.css'],
  imports: [CommonModule, FormsModule],
})
export class UploadClientsComponent {
  clients: any[] = [];

  constructor(private clientsService: ClientsService) { }

  // Handle file upload
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e: any) => {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(e.target.result);
        const worksheet = workbook.worksheets[0];
        const data: any[] = [];

        worksheet.eachRow((row, rowIndex) => {
          if (rowIndex > 1) {
            const client = {
              name: row.getCell(1).value,
              taxId: row.getCell(2).value,
              email: row.getCell(3).value,
              phone: row.getCell(4).value,
              openingBalance: row.getCell(5).value || 0,
            };
            data.push(client);
          }
        });

        this.clients = data;
      };
      reader.readAsArrayBuffer(file);
    }
  }

  // Download template
  async downloadTemplate(): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Clients');

    // Add headers
    worksheet.addRow(['Client Name', 'Tax ID', 'Email', 'Phone', 'Opening Balance']);

    // Create a downloadable file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'Clients_Template.xlsx';
    link.click();
  }

  // Delete a client row
  deleteClient(index: number): void {
    this.clients.splice(index, 1);
  }

  // Upload clients to backend
  uploadClients(): void {
    this.clientsService.bulkUploadClients(this.clients).subscribe(
      (response) => {
        alert('Clients uploaded successfully!');
        this.clients = [];
      },
      (error) => {
        alert('Error uploading clients: ' + error.message);
      }
    );
  }
}
