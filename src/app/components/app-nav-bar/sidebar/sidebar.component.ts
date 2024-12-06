import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LogoComponent } from "./logo/logo.component";
import { MenuItemComponent } from "../menu-item/menu-item.component";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [CommonModule, LogoComponent, MenuItemComponent]
})
export class SidebarComponent {
  @Input() isOpen = false;

  menuItems = [
    {
      icon: 'dashboard',
      label: 'Dashboard',
      routerLink: '/app', // Root dashboard path
      isExpandable: false,
    },
    {
      icon: 'receipt',
      label: 'Invoices',
      routerLink: 'invoice',
      isExpandable: false,
    },
    {
      icon: 'inventory',
      label: 'Accounts',
      routerLink: null, // No direct route for expandable items
      isExpandable: true,
      children: [
        {
          icon: 'account_balance',
          label: 'Chart of Accounts',
          routerLink: 'chartofaccounts',
        },
        {
          icon: 'receipt',
          label: 'Account Statement',
          routerLink: 'account-statement/:accountId', // Placeholder for dynamic route
        },
      ],
    },
    {
      icon: 'description',
      label: 'Transactions',
      routerLink: null,
      isExpandable: true,
      children: [
        {
          icon: 'edit_note',
          label: 'Journal Entry',
          routerLink: 'journal-entry',
        },
        {
          icon: 'list',
          label: 'Journal List',
          routerLink: 'journal-list',
        },
      ],
    },

  ];


}
