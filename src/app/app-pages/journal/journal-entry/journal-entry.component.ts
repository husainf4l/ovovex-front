import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartOfAccountsService } from '../../../services/chart-of-accounts.service';
import { JournalEntryPayload, JournalEntryService } from '../../../services/journal-entry.service';
import { JournalEntry } from '../../../models/interfaces.model';
import { TableComponent } from "../../../components/shared/table/table.component";
import { DateSelectorComponent } from "../../../components/shared/date-selector/date-selector.component";
import { SearchInputComponent } from "../../../components/shared/search-input/search-input.component";
import { ErrorAlertComponent } from "../../../components/shared/error-alert/error-alert.component";
import { ButtonComponent } from "../../../components/shared/button/button.component";

@Component({
  selector: 'app-journal-entry',
  templateUrl: './journal-entry.component.html',
  styleUrls: ['./journal-entry.component.css'],
  imports: [CommonModule, FormsModule, DateSelectorComponent, TableComponent, SearchInputComponent, ErrorAlertComponent, ButtonComponent],
  providers: [ChartOfAccountsService, JournalEntryService],
})
export class JournalEntryComponent implements OnInit {
  journalId = this.generateJournalId();
  searchQuery = ''
  journalDate = new Date().toISOString().substring(0, 10);
  newEntry: Partial<JournalEntry> = {
    accountId: '',
    account: '',
    debit: 0,
    credit: 0,
    notes: '',
  };
  journalEntries: JournalEntry[] = [];
  formattedJournalEntries: any[] = [];
  accounts: { id: string; accountNumber: string; name: string }[] = [];
  filteredAccounts: { id: string; accountNumber: string; name: string }[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private chartOfAccountsService: ChartOfAccountsService,
    private journalEntryService: JournalEntryService
  ) { }

  ngOnInit(): void {
    this.fetchAccounts();
  }

  generateJournalId(): string {
    return `JE-${new Date().getTime()}`;
  }

  fetchAccounts(): void {
    this.loading = true;
    this.chartOfAccountsService.getAccounts().subscribe({
      next: (data) => {
        this.accounts = data.map((acc: any) => ({
          id: acc.id,
          accountNumber: acc.hierarchyCode,
          name: acc.name,
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching accounts:', err);
        this.error = 'Failed to load accounts. Please try again later.';
        this.loading = false;
      },
    });
  }

  filterAccounts(query: string): void {
    this.filteredAccounts = this.accounts.filter(
      (account) =>
        account.name.toLowerCase().includes(query.toLowerCase()) ||
        account.accountNumber.includes(query)
    );
  }

  selectAccount(account: { id: string; accountNumber: string; name: string }): void {
    this.newEntry.accountId = account.id;
    this.newEntry.account = `${account.accountNumber} - ${account.name}`;
    this.filteredAccounts = [];
  }
  addEntry(): void {
    if (!this.newEntry.account || (!this.newEntry.debit && !this.newEntry.credit)) {
      alert('Please fill all required fields for the entry!');
      return;
    }

    if (this.newEntry.debit && this.newEntry.credit) {
      alert('An entry cannot have both debit and credit values.');
      return;
    }

    const entry: JournalEntry = {
      accountId: this.newEntry.accountId || '',
      account: this.newEntry.account || '',
      debit: this.newEntry.debit || 0,
      credit: this.newEntry.credit || 0,
      notes: this.newEntry.notes || '',
    };

    this.journalEntries.push(entry);
    this.formatJournalEntries();

    // Reset the input fields for the next entry
    this.newEntry = {
      accountId: '',
      account: '',
      debit: 0,
      credit: 0,
      notes: '',
    };

    // Clear the search query explicitly
    this.searchQuery = '';
  }


  removeEntry(entry: JournalEntry): void {
    this.journalEntries = this.journalEntries.filter(e => e !== entry);
    this.formatJournalEntries(); // Update formatted entries
  }

  formatJournalEntries(): void {
    this.formattedJournalEntries = this.journalEntries.map(entry => ({
      account: entry.account,
      debit: entry.debit,
      credit: entry.credit,
      notes: entry.notes,
      actions: [
        {
          label: 'Remove',
          handler: () => this.removeEntry(entry),
          style: 'bg-red-600 hover:bg-red-700',
        },
      ],
    }));
  }


  submitEntry(): void {
    if (this.journalEntries.length === 0) {
      alert('Please add at least one entry before submitting!');
      return;
    }

    if (this.totalDebit !== this.totalCredit) {
      alert('Debit and Credit totals must be equal before submitting!');
      return;
    }

    const payload: JournalEntryPayload = {
      date: this.journalDate,
      transactions: this.journalEntries.map((entry) => ({
        accountId: entry.accountId,
        debit: entry.debit || null,
        credit: entry.credit || null,
        notes: entry.notes || '',
      })),
    };

    this.loading = true;
    this.journalEntryService.createJournalEntry(payload).subscribe({
      next: () => {
        alert('Journal entry submitted successfully!');
        this.journalEntries = [];
        this.formatJournalEntries();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error submitting journal entry:', err);
        alert('Failed to submit journal entry. Please try again.');
        this.loading = false;
      },
    });
  }

  get totalDebit(): number {
    return this.journalEntries.reduce((sum, entry) => sum + entry.debit, 0);
  }

  get totalCredit(): number {
    return this.journalEntries.reduce((sum, entry) => sum + entry.credit, 0);
  }
}
