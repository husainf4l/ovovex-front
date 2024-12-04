import { Component, OnInit } from '@angular/core';
import { JournalEntryService } from '../../../services/journal-entry.service';
import { Journals, transactions } from '../../../models/interfaces.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-journal-list',
  templateUrl: './journal-list.component.html',
  styleUrls: ['./journal-list.component.css'],
  imports: [CommonModule, FormsModule]
})
export class JournalListComponent implements OnInit {
  journals: Journals[] = [];
  displayedJournals: Journals[] = [];
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
        this.displayedJournals = [...this.journals]; // Initialize display data
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching journals:', err);
        this.error = 'Failed to load journal entries. Please try again later.';
        this.loading = false;
      },
    });
  }

  onSearch(query: string): void {
    this.searchQuery = query.toLowerCase();
    this.displayedJournals = this.journals.filter((journal) =>
      journal.transactions.some((transaction) =>
        transaction.account?.name.toLowerCase().includes(this.searchQuery)
      )
    );
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.displayedJournals = [...this.journals];
  }
}
