import { Component, OnInit } from '@angular/core';
import { JournalEntryService } from '../../../services/journal-entry.service';
import { Journals } from '../../../models/interfaces.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableComponent } from "../../../components/shared/table/table.component";

@Component({
  selector: 'app-journal-list',
  templateUrl: './journal-list.component.html',
  styleUrls: ['./journal-list.component.css'],
  imports: [CommonModule, FormsModule, TableComponent]
})
export class JournalListComponent implements OnInit {
  formattedJournals: any[] = []; // Transformed data for the data table
  journals: Journals[] = []; // Raw journals from the service
  displayedJournals: Journals[] = []; // Filtered and displayed journals
  searchQuery: string = '';
  loading: boolean = false;
  error: string | null = null;

  constructor(private journalEntryService: JournalEntryService) { }

  ngOnInit(): void {
    this.fetchJournals();
  }

  fetchJournals(): void {
    this.loading = true;
    this.error = null;

    this.journalEntryService.getAllJournalEntries().subscribe({
      next: (data) => {
        this.journals = data; // Store the raw data
        this.displayedJournals = [...this.journals]; // Initialize displayed data
        this.formatJournals(); // Update formatted journals
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching journals:', err);
        this.error = 'Failed to load journal entries. Please try again later.';
        this.loading = false;
      },
    });
  }

  formatJournals(): void {
    this.formattedJournals = this.displayedJournals.flatMap((journal) =>
      journal.transactions.map((transaction) => ({
        journalId: journal.date,
        accountName: transaction.account?.name || '—',
        debit: transaction.debit || '-',
        credit: transaction.credit || '-',
        notes: transaction.notes || '—',
      }))
    );
  }

  onSearch(query: string): void {
    this.searchQuery = query.toLowerCase();
    this.displayedJournals = this.journals.filter((journal) =>
      journal.transactions.some((transaction) =>
        transaction.account?.name.toLowerCase().includes(this.searchQuery)
      )
    );
    this.formatJournals(); // Update formatted journals after search
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.displayedJournals = [...this.journals];
    this.formatJournals(); // Update formatted journals after clearing search
  }
}
