import { Routes } from '@angular/router';
import { WebsiteLayoutComponent } from './layouts/website-layout/website-layout.component';
import { AppLayoutComponent } from './layouts/app-layout/app-layout.component';
import { AuthGuard } from './services/auth/auth.guard';

export const routes: Routes = [
    // Website layout routes
    {
        path: '',
        component: WebsiteLayoutComponent,
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('./web-site-pages/home-page/home-page.component').then(
                        (m) => m.HomePageComponent
                    ),
            },
            {
                path: 'login',
                loadComponent: () =>
                    import('./web-site-pages/login/login.component').then(
                        (m) => m.LoginComponent
                    ),
            },
            {
                path: 'signup',
                loadComponent: () =>
                    import('./web-site-pages/signup/signup.component').then(
                        (m) => m.SignupComponent
                    ),
            },
        ],
    },

    {
        path: 'app',
        component: AppLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('./pages/dashboard/dashboard.component').then(
                        (m) => m.DashboardComponent
                    ),
            },
            {
                path: 'chartofaccounts',
                loadComponent: () =>
                    import(
                        './pages/accounts/chart-of-accounts/chart-of-accounts.component'
                    ).then((m) => m.ChartOfAccountsComponent),
            },
            {
                path: 'invoice',
                loadComponent: () =>
                    import('./pages/invoice/invoice.component').then(
                        (m) => m.InvoiceComponent
                    ),
            },
            {
                path: 'journal-entry',
                loadComponent: () =>
                    import('./pages/journal/journal-entry/journal-entry.component').then(
                        (m) => m.JournalEntryComponent
                    ),
            },
            {
                path: 'journal-list',
                loadComponent: () =>
                    import('./pages/journal/journal-list/journal-list.component').then(
                        (m) => m.JournalListComponent
                    ),
            },
            {
                path: 'account-statement/:accountId',
                loadComponent: () =>
                    import(
                        './pages/accounts/account-statement/account-statement.component'
                    ).then((m) => m.AccountStatementComponent),
            },
        ],
    },
];
