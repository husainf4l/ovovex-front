import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartOfAccountsService } from '../../services/chart-of-accounts.service';
import { JournalEntryPayload, JournalEntryService } from '../../services/journal-entry.service';

interface JournalEntry {
  accountId: string;
  account: string;
  debit: number;
  credit: number;
  notes: string;
}

@Component({
  selector: 'app-journal-entry',
  templateUrl: './journal-entry.component.html',
  styleUrls: ['./journal-entry.component.css'],
  imports: [CommonModule, FormsModule],
  providers: [ChartOfAccountsService, JournalEntryService],
})
export class JournalEntryComponent implements OnInit {
  journalId = `JE-${new Date().getTime()}`;
  journalDate = new Date().toISOString().substring(0, 10);
  today = new Date().toISOString().substring(0, 10);
  searchQuery = '';
  newEntry: Partial<JournalEntry> = {
    accountId: '',
    account: '',
    debit: 0,
    credit: 0,
    notes: '',
  };
  journalEntries: JournalEntry[] = [];
  accounts: { id: string; accountNumber: string; name: string }[] = [];
  filteredAccounts: { id: string; accountNumber: string; name: string }[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private chartOfAccountsService: ChartOfAccountsService,
    private journalEntryService: JournalEntryService
  ) { }

  ngOnInit(): void {
    this.fetchAccounts();
  }

  fetchAccounts(): void {
    this.loading = true;
    this.chartOfAccountsService.getAccounts().subscribe({
      next: (data) => {
        this.accounts = data.map((acc: any) => ({
          id: acc.id,
          accountNumber: acc.accountNumber,
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

  filterAccounts(): void {
    if (!this.searchQuery.trim()) {
      this.filteredAccounts = [];
      return;
    }

    this.filteredAccounts = this.accounts.filter(
      (account) =>
        account.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        account.accountNumber.includes(this.searchQuery)
    );

    if (this.filteredAccounts.length === 0) {
      this.error = 'No matching accounts found.';
    } else {
      this.error = null;
    }
  }

  selectAccount(account: { id: string; accountNumber: string; name: string }): void {
    this.newEntry.accountId = account.id;
    this.newEntry.account = `${account.accountNumber} - ${account.name}`;
    this.searchQuery = '';
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

    this.newEntry = {
      accountId: '',
      account: '',
      debit: 0,
      credit: 0,
      notes: '',
    };
    this.searchQuery = '';
  }

  addBalancingEntry(): void {
    const remainingBalance = this.totalDebit - this.totalCredit;
    if (remainingBalance === 0) {
      alert('The journal is already balanced!');
      return;
    }

    const accountToBalance = this.accounts.find((acc) => acc.accountNumber === '99999') || {
      id: '99999',
      accountNumber: '99999',
      name: 'Balancing Account',
    };

    const entry: JournalEntry = {
      accountId: accountToBalance.id,
      account: `${accountToBalance.accountNumber} - ${accountToBalance.name}`,
      debit: remainingBalance > 0 ? 0 : Math.abs(remainingBalance),
      credit: remainingBalance > 0 ? remainingBalance : 0,
      notes: 'Auto-generated balancing entry',
    };

    this.journalEntries.push(entry);
  }

  removeEntry(entry: JournalEntry): void {
    this.journalEntries = this.journalEntries.filter((e) => e !== entry);
  }

  submitEntry() {
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


    this.journalEntryService.createJournalEntry(payload).subscribe({
      next: (response) => {
        console.log('Journal entry submitted successfully:', response);
        alert('Journal entry submitted successfully!');
        this.journalEntries = [];
      },
      error: (err) => {
        console.error('Error submitting journal entry:', err);
        alert('Failed to submit journal entry. Please try again.');
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
