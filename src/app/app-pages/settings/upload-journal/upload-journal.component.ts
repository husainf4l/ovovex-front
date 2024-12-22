import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { JournalEntryService } from '../../../services/journal-entry.service';

interface JournalEntry {
  account: string;
  hierarchyCode: string;
  debit: number;
  credit: number;
  notes?: string;

}


@Component({
  selector: 'app-upload-journal',
  templateUrl: './upload-journal.component.html',
  styleUrls: ['./upload-journal.component.css'],
  imports: [CommonModule]
})
export class UploadJournalComponent {
  journalEntries: JournalEntry[] = [];


  constructor(private journalService: JournalEntryService) { }


  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(reader.result as ArrayBuffer);
      const worksheet = workbook.worksheets[0];

      const tempEntries: JournalEntry[] = [];
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip header row

        tempEntries.push({
          hierarchyCode: row.getCell(1).value?.toString() || '',
          account: row.getCell(2).value?.toString() || '',
          debit: +(row.getCell(3).value ?? 0), // Safely parse debit
          credit: +(row.getCell(4).value ?? 0),
          notes: row.getCell(5).value?.toString() || '',

        });
      });

      this.journalEntries = tempEntries;
    };

    reader.readAsArrayBuffer(file);
  }


  submitData(): void {
    if (this.journalEntries.length === 0) {
      alert('No journal entries to submit. Please upload a valid file.');
      return;
    }

    this.journalService.submitJournalEntries(this.journalEntries).subscribe(
      (response) => {
        alert('Journal entries uploaded successfully!');
        console.log(response);
      },
      (error) => {
        console.error('Error:', error);
        alert('Failed to upload journal entries.');
      }
    );
  }

}
