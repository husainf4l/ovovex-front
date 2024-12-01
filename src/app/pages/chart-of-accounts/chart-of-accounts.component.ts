import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

interface Account {
  id: string;
  name: string;
  fullName: string;
  accountNumber: string | null;
  accountType: string;
  accountSubType: string;
  parentAccount: string | null;
  currentBalance: number;
  currencyCode: string;
  subLevel: number;
  expanded?: boolean;
}

@Component({
  selector: 'app-chart-of-accounts',
  templateUrl: './chart-of-accounts.component.html',
  styleUrls: ['./chart-of-accounts.component.css'],
  imports: [CommonModule, MatIconModule, FormsModule],
  standalone: true,
})
export class ChartOfAccountsComponent {
  chartOfAccounts: Account[] = [];
  filteredAccounts: Account[] = [];
  searchQuery: string = '';
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor() {
    const rawData = this.getRawData();
    this.chartOfAccounts = this.parseAccounts(rawData);
    this.filteredAccounts = [...this.chartOfAccounts];
  }

  getRawData() {
    return [
      {
        "$type": "/Result",
        "data": [
          {
            "company": {
              "ledgerAccounts": {
                "edges": [
                  // Assets
                  {
                    "node": {
                      "id": "1",
                      "name": "Assests",
                      "fullName": "Cash and Cash Equivalents",
                      "accountNumber": "1000",
                      "parentAccount": null,
                      "currentBalanceWithSubAccounts": "50000.00",
                      "currencyInfo": { "code": "AED" },
                      "qboAppData": {
                        "localizedAccountType": "Assets",
                        "localizedAccountSubType": "Cash and cash equivalents"
                      },
                      "subLevel": 0
                    }
                  },
                  {
                    "node": {
                      "id": "2",
                      "name": "Bank ",
                      "fullName": "Bank - AED",
                      "accountNumber": "1010",
                      "parentAccount": "1",
                      "currentBalanceWithSubAccounts": "30000.00",
                      "currencyInfo": { "code": "AED" },
                      "qboAppData": {
                        "localizedAccountType": "Assets",
                        "localizedAccountSubType": "Bank accounts"
                      },
                      "subLevel": 2
                    }
                  },
                  
                  {
                    "node": {
                      "id": "3",
                      "name": "Accounts Payable",
                      "fullName": "Accounts Payable",
                      "accountNumber": "2000",
                      "parentAccount": null,
                      "currentBalanceWithSubAccounts": "-25000.00",
                      "currencyInfo": { "code": "AED" },
                      "qboAppData": {
                        "localizedAccountType": "Liabilities",
                        "localizedAccountSubType": "Payables"
                      },
                      "subLevel": 0
                    }
                  },
                  // Revenue
                  {
                    "node": {
                      "id": "4",
                      "name": "Sales Revenue",
                      "fullName": "Sales Revenue",
                      "accountNumber": "4000",
                      "parentAccount": null,
                      "currentBalanceWithSubAccounts": "120000.00",
                      "currencyInfo": { "code": "AED" },
                      "qboAppData": {
                        "localizedAccountType": "Revenue",
                        "localizedAccountSubType": "Sales"
                      },
                      "subLevel": 0
                    }
                  }
                ]
              }
            }
          }
        ]
      }
    ];
  }
  

  parseAccounts(data: any): Account[] {
    const accounts: Account[] = [];
    const edges = data[0]?.data[0]?.company?.ledgerAccounts?.edges || [];
  
    edges.forEach((edge: any) => {
      const node = edge.node;
      accounts.push({
        id: node.id,
        name: node.name,
        fullName: node.fullName,
        accountNumber: node.accountNumber,
        accountType: node.qboAppData.localizedAccountType,
        accountSubType: node.qboAppData.localizedAccountSubType,
        parentAccount: node.parentAccount,
        currentBalance: parseFloat(node.currentBalanceWithSubAccounts),
        currencyCode: node.currencyInfo.code,
        subLevel: node.subLevel,
        expanded: true // Default expanded for top-level accounts
      });
    });
  
    return accounts;
  }
  

  toggleExpand(account: Account): void {
    account.expanded = !account.expanded;
    this.applyFilters();
  }

  getAccountsToDisplay(): Account[] {
    return this.filteredAccounts.filter((account) => {
      if (!account.parentAccount) return true;
      const parent = this.chartOfAccounts.find((acc) => acc.id === account.parentAccount);
      return parent?.expanded;
    });
  }

  applyFilters(): void {
    let accounts = this.chartOfAccounts;
  
    // Filter by search query
    if (this.searchQuery.trim()) {
      accounts = accounts.filter((account) =>
        account.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  
    // Apply sorting
    if (this.sortColumn) {
      accounts = accounts.sort((a, b) => {
        const aValue = a[this.sortColumn as keyof Account] ?? ''; // Fallback to an empty string
        const bValue = b[this.sortColumn as keyof Account] ?? '';
  
        let comparison = 0;
        if (aValue < bValue) {
          comparison = -1;
        } else if (aValue > bValue) {
          comparison = 1;
        }
  
        return this.sortDirection === 'asc' ? comparison : -comparison;
      });
    }
  
    this.filteredAccounts = accounts;
  }
  

  onSearch(query: string): void {
    this.searchQuery = query;
    this.applyFilters();
  }

  sortBy(column: string): void {
    this.sortColumn = column;
    this.sortDirection = this.sortColumn === column && this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.applyFilters();
  }

  editAccount(account: Account): void {
    console.log('Edit:', account);
  }

  deleteAccount(account: Account): void {
    console.log('Delete:', account);
  }

  isParentAccount(account: Account): boolean {
    return this.chartOfAccounts.some((child) => child.parentAccount === account.id);
  }
}
