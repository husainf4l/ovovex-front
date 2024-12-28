import { Component, OnInit } from '@angular/core';
import { LinkingAccountsService } from '../../../services/linking-accounts.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountService } from '../../../services/account.service';


interface Role {
  name: string;
  selectedAccountId: string;
  currentLinkedAccount?: { id: string; name: string } | null; // Allow null
}



@Component({
  selector: 'app-linkingaccounts',
  templateUrl: './linkingaccounts.component.html',
  styleUrls: ['./linkingaccounts.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class LinkingAccountsComponent implements OnInit {
  linkingAccounts: any[] = [];
  roles: Role[] = [
    { name: 'Cash Account', selectedAccountId: '' },
    { name: 'Accounts Receivable', selectedAccountId: '' },
    { name: 'Accounts Payable', selectedAccountId: '' },
    { name: 'Sales Revenue', selectedAccountId: '' },
    { name: 'COGS (Cost of Goods Sold)', selectedAccountId: '' },
    { name: 'Inventory', selectedAccountId: '' },
    { name: 'Fixed Assets', selectedAccountId: '' },
    { name: 'Depreciation Expense', selectedAccountId: '' },
    { name: 'Accrued Expenses', selectedAccountId: '' },
    { name: 'Shareholder Equity', selectedAccountId: '' },
    { name: 'Retained Earnings', selectedAccountId: '' },
    { name: 'Taxes Payable', selectedAccountId: '' },
    { name: 'Sales Tax', selectedAccountId: '' },
    { name: 'Income Tax', selectedAccountId: '' },
    { name: 'Other Income', selectedAccountId: '' },
    { name: 'Operating Expenses', selectedAccountId: '' },
    { name: 'Non-Operating Expenses', selectedAccountId: '' },
    { name: 'Prepaid Expenses', selectedAccountId: '' },
    { name: 'Deferred Revenue', selectedAccountId: '' },
    { name: 'Loans Payable', selectedAccountId: '' },
    { name: 'Opening Balance Equity', selectedAccountId: '' },

  ];
  allAccounts: any[] = [];
  filteredAccounts: any[] = [];
  searchTerm: string = '';

  constructor(
    private linkingAccountsService: LinkingAccountsService,
    private accountsService: AccountService
  ) { }

  ngOnInit(): void {
    this.fetchLinkingAccounts();
  }

  fetchLinkingAccounts(): void {
    this.linkingAccountsService.getAll().subscribe({
      next: (data) => {
        this.linkingAccounts = data || [];
        this.updateRolesWithLinkedAccounts();
        this.fetchAllAccounts();
      },
      error: (err) => {
        console.error('Error fetching linking accounts:', err);
      },
    });
  }

  fetchAllAccounts(): void {
    this.accountsService.getAccounts().subscribe({
      next: (accounts) => {
        this.allAccounts = accounts;
        this.filteredAccounts = accounts;
      },
      error: (err) => {
        console.error('Error fetching accounts:', err);
      },
    });
  }

  filterAccounts(): void {
    this.filteredAccounts = this.allAccounts.filter((account) =>
      account.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  updateRolesWithLinkedAccounts(): void {
    this.roles.forEach((role) => {
      const linkedAccount = this.linkingAccounts.find(
        (link) => link.role === role.name
      );
      role.currentLinkedAccount = linkedAccount?.account
        ? { id: linkedAccount.account.id, name: linkedAccount.account.name }
        : undefined;
    });
  }

  linkAccount(role: Role): void {
    if (!role.selectedAccountId) {
      alert(`Please select an account to link for the role: ${role.name}`);
      return;
    }

    const payload = {
      role: role.name,
      accountId: role.selectedAccountId,
      description: `Linked ${role.name} to ${role.selectedAccountId}`,
    };

    this.linkingAccountsService.create(payload).subscribe({
      next: () => {
        alert(`${role.name} successfully linked!`);
        this.fetchLinkingAccounts();
      },
      error: (err) => {
        console.error('Error linking account:', err);
        alert(`Failed to link ${role.name}. Please try again.`);
      },
    });
  }

  unlinkAccount(role: Role): void {
    const linkedAccount = this.linkingAccounts.find(
      (link) => link.role === role.name
    );

    if (!linkedAccount) {
      alert(`No linked account found for the role: ${role.name}`);
      return;
    }

    this.linkingAccountsService.delete(linkedAccount.id).subscribe({
      next: () => {
        alert(`${role.name} successfully unlinked!`);
        this.fetchLinkingAccounts();
      },
      error: (err) => {
        console.error('Error unlinking account:', err);
        alert(`Failed to unlink ${role.name}. Please try again.`);
      },
    });
  }
}
