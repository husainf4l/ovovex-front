import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LogoComponent } from "./logo/logo.component";
import { MenuItemComponent } from "../menu-item/menu-item.component";
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [CommonModule, LogoComponent, MenuItemComponent]
})
export class SidebarComponent {
  @Input() isOpen = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  closeSidebar(): void {
    this.toggleSidebar.emit();
  }



  menuItems = [
    {
      icon: 'dashboard',
      label: 'Dashboard',
      routerLink: '/app', // Root dashboard path
      isExpandable: false,
    },

    {
      icon: 'receipt',
      label: 'Receipt',
      routerLink: null,
      isExpandable: true,
      children: [
        {
          icon: 'description',
          label: 'Create Receipt',
          routerLink: 'receipt-entry',
        },
        {
          icon: 'view_list',
          label: 'receipt List',
          routerLink: 'receipt/receipt-list',
        },

      ],
    },

    {
      icon: 'receipt',
      label: 'Invoices',
      routerLink: null,
      isExpandable: true,
      children: [
        {
          icon: 'description',
          label: 'Create Invoice',
          routerLink: 'invoice',
        },
        {
          icon: 'view_list',
          label: 'Invoice List',
          routerLink: 'invoice/invoice-list',
        },
        {
          icon: 'details',
          label: 'Invoice Details',
          routerLink: 'invoice/invoice-details/0',
        },
      ],
    },
    {
      icon: 'account_balance',
      label: 'Accounts',
      routerLink: null,
      isExpandable: true,
      children: [
        {
          icon: 'table_chart',
          label: 'Chart of Accounts',
          routerLink: 'chartofaccounts',
        },
        {
          icon: 'table_chart',
          label: 'Add Account',
          routerLink: 'chartofaccounts/add',
        },
        {
          icon: 'receipt_long',
          label: 'Account Statement',
          routerLink: 'account-statement',
        },
      ],
    },
    {
      icon: 'paid',
      label: 'Cheques',
      routerLink: null,
      isExpandable: true,
      children: [
        {
          icon: 'post_add',
          label: 'New Cheque',
          routerLink: 'cheque-entry',
        },
        {
          icon: 'format_list_bulleted',
          label: 'Cheque List',
          routerLink: 'cheque-list',
        },
      ],
    },
    {
      icon: 'analytics',
      label: 'Reports',
      routerLink: null,
      isExpandable: true,
      children: [
        {
          icon: 'assessment',
          label: 'Financial Reports',
          routerLink: 'reports/financial',
          isExpandable: true,
          children: [
            {
              icon: 'show_chart',
              label: 'Profit & Loss',
              routerLink: 'reports/financial/profit-loss',
            },
            {
              icon: 'insights',
              label: 'Balance Sheet',
              routerLink: 'reports/financial/balance-sheet',
            },
            {
              icon: 'account_tree',
              label: 'Trial Balance',
              routerLink: 'reports/financial/trial-balance',
            },
          ],
        },
        {
          icon: 'inventory',
          label: 'Inventory Reports',
          routerLink: 'reports/inventory',
          isExpandable: true,
          children: [
            {
              icon: 'view_list',
              label: 'Stock Summary',
              routerLink: 'reports/inventory/stock-summary',
            },
            {
              icon: 'swap_horiz',
              label: 'Stock Movement',
              routerLink: 'reports/inventory/stock-movement',
            },
            {
              icon: 'store',
              label: 'Stock Valuation',
              routerLink: 'reports/inventory/stock-valuation',
            },
          ],
        },
        {
          icon: 'group',
          label: 'Employee Reports',
          routerLink: 'reports/employees',
          isExpandable: true,
          children: [
            {
              icon: 'calendar_month',
              label: 'Attendance Report',
              routerLink: 'reports/employees/attendance',
            },
            {
              icon: 'event',
              label: 'Timesheet Report',
              routerLink: 'reports/employees/timesheet',
            },
            {
              icon: 'monetization_on',
              label: 'Payroll Report',
              routerLink: 'reports/employees/payroll',
            },
          ],
        },
        {
          icon: 'credit_card',
          label: 'Receivable Reports',
          routerLink: 'reports/receivables',
          isExpandable: true,
          children: [
            {
              icon: 'pending',
              label: 'Aging Report',
              routerLink: 'reports/receivables/aging',
            },
            {
              icon: 'payment',
              label: 'Pending Invoices',
              routerLink: 'reports/receivables/pending',
            },
          ],
        },
        {
          icon: 'money_off',
          label: 'Payable Reports',
          routerLink: 'reports/payables',
          isExpandable: true,
          children: [
            {
              icon: 'schedule',
              label: 'Aging Report',
              routerLink: 'reports/payables/aging',
            },
            {
              icon: 'credit_score',
              label: 'Pending Payments',
              routerLink: 'reports/payables/pending',
            },
          ],
        },
      ],
    },
    {
      icon: 'category',
      label: 'Products',
      routerLink: null,
      isExpandable: true,
      children: [
        {
          icon: 'view_list',
          label: 'Product List',
          routerLink: 'products/list',
        },
        {
          icon: 'add_circle',
          label: 'Add Product',
          routerLink: 'products/add',
        },
        {
          icon: 'update',
          label: 'Stock to Date',
          routerLink: 'products/stock',
        },
        {
          icon: 'compare_arrows',
          label: 'Stock Movement',
          routerLink: 'products/movement',
        },
      ],
    },
    {
      icon: 'group',
      label: 'Employees',
      routerLink: null,
      isExpandable: true,
      children: [
        {
          icon: 'list',
          label: 'Employee List',
          routerLink: 'employees/list',
        },
        {
          icon: 'person_add',
          label: 'Add Employee',
          routerLink: 'employees/add',
        },
        {
          icon: 'schedule',
          label: 'Attendance',
          routerLink: 'employees/attendance',
        },
      ],
    },
    {
      icon: 'settings',
      label: 'Settings',
      routerLink: null,
      isExpandable: true,
      children: [
        {
          icon: 'build',
          label: 'General Settings',
          routerLink: 'settings/general',
        },
        {
          icon: 'security',
          label: 'User Permissions',
          routerLink: 'settings/permissions',
        },
        {
          icon: 'notifications',
          label: 'Notification Settings',
          routerLink: 'settings/notifications',
        },
      ],
    },
    {
      icon: 'people',
      label: 'Client Management',
      routerLink: null,
      isExpandable: true,
      children: [
        {
          icon: 'list',
          label: 'Client List',
          routerLink: 'clients/list',
        },
        {
          icon: 'person_add',
          label: 'Add Client',
          routerLink: 'clients/add',
        },
        {
          icon: 'history',
          label: 'Client History',
          routerLink: 'clients/history',
        },
      ],
    },
    {
      icon: 'warehouse',
      label: 'Warehouse',
      routerLink: null,
      isExpandable: true,
      children: [
        {
          icon: 'inventory',
          label: 'Inventory Overview',
          routerLink: 'warehouse/inventory-overview',
        },
        {
          icon: 'add',
          label: 'Add Inventory Item',
          routerLink: 'warehouse/add-inventory-item',
        },
        {
          icon: 'compare_arrows',
          label: 'Stock Movement',
          routerLink: 'warehouse/stock-movement',
        },
        {
          icon: 'store',
          label: 'Stock Valuation',
          routerLink: 'warehouse/stock-valuation',
        },
        {
          icon: 'receipt_long',
          label: 'Purchase Orders',
          routerLink: 'warehouse/purchase-orders',
        },
        {
          icon: 'assignment_returned',
          label: 'Returns Management',
          routerLink: 'warehouse/returns-management',
        },
        {
          icon: 'local_shipping',
          label: 'Suppliers',
          routerLink: 'warehouse/suppliers',
          isExpandable: true,
          children: [
            {
              icon: 'list',
              label: 'Supplier List',
              routerLink: 'warehouse/suppliers/list',
            },
            {
              icon: 'person_add',
              label: 'Add Supplier',
              routerLink: 'warehouse/suppliers/add',
            },
          ],
        },
        {
          icon: 'bar_chart',
          label: 'Warehouse Reports',
          routerLink: null,
          isExpandable: true,
          children: [
            {
              icon: 'inventory_2',
              label: 'Inventory Summary',
              routerLink: 'warehouse/reports/inventory-summary',
            },
            {
              icon: 'analytics',
              label: 'Stock Aging Report',
              routerLink: 'warehouse/reports/stock-aging',
            },
            {
              icon: 'insights',
              label: 'Stock Valuation Report',
              routerLink: 'warehouse/reports/stock-valuation',
            },
          ],
        },
      ],
    },
    {
      icon: 'view_kanban',
      label: 'Kanban',
      routerLink: 'kanban', // Direct route for Kanban board
      isExpandable: false,
    },
  ];








}
//receipt