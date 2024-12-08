import { PreloadAllModules, Routes } from '@angular/router';
import { WebsiteLayoutComponent } from './layouts/website-layout/website-layout.component';
import { LayoutComponent } from './layouts/app-layout/layout/layout.component';
import { AuthGuard } from './services/auth/auth.guard';

export const routes: Routes = [
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
        component: LayoutComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('./app-pages/dashboard/dashboard.component').then(
                        (m) => m.DashboardComponent
                    ),
            },
            {
                path: 'chartofaccounts',
                loadComponent: () =>
                    import(
                        './app-pages/accounts/chart-of-accounts/chart-of-accounts.component'
                    ).then((m) => m.ChartOfAccountsComponent),
            },
            {
                path: 'invoice',
                loadComponent: () =>
                    import('./app-pages/invoice/invoice.component').then(
                        (m) => m.InvoiceComponent
                    ),
            },
            {
                path: 'journal-entry',
                loadComponent: () =>
                    import('./app-pages/journal/journal-entry/journal-entry.component').then(
                        (m) => m.JournalEntryComponent
                    ),
            },
            {
                path: 'journal-list',
                loadComponent: () =>
                    import('./app-pages/journal/journal-list/journal-list.component').then(
                        (m) => m.JournalListComponent
                    ),
            },
            {
                path: 'account-statement',
                loadComponent: () =>
                    import('./app-pages/accounts/account-statement/account-statement.component').then(
                        (m) => m.AccountStatementComponent
                    ),
            },
            {
                path: 'account-statement/:accountId',
                loadComponent: () =>
                    import('./app-pages/accounts/account-statement/account-statement.component').then(
                        (m) => m.AccountStatementComponent
                    ),
            },
        ],
    },
    {
        path: '**',
        loadComponent: () =>
            import('./web-site-pages/not-found/not-found.component').then(
                (m) => m.NotFoundComponent
            ),
    },
];

export const routingConfig = {
    preloadingStrategy: PreloadAllModules,
    initialNavigation: 'enabledBlocking',
};
