import { Component } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { AccountAdd } from '../../../models/interfaces.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-account',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.css'],
})
export class AddAccountComponent {
  account: AccountAdd = {
    name: '',
    accountType: 'ASSET',
    openingBalance: 0,
    mainAccount: false,
    parentAccountId: null,
  };

  mainAccounts: AccountAdd[] = []; // Main accounts loaded from the backend

  constructor(private accountService: AccountService, private router: Router) { }

  ngOnInit(): void {
    this.loadMainAccounts();
  }



  loadMainAccounts(): void {
    this.accountService.getMainAccounts().subscribe({
      next: (accounts) => {
        this.mainAccounts = accounts;
      },
      error: (err) => {
        console.error('Error loading main accounts:', err);
      },
    });
  }

  onSubmit(): void {
    if (!this.account.parentAccountId) {
      alert('Please select a parent account.');
      return;
    }

    this.accountService.createAccount(this.account).subscribe({
      next: () => {
        alert('Account created successfully!');
        this.router.navigate(['/app/chartofaccounts']);
      },
      error: (err) => {
        console.error('Error creating account:', err);
      },
    });
  }
}
