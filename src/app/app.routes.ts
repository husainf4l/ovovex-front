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
                data: {
                    title: 'Ovovex - Simplify Your Accounting',
                    description: 'Ovovex Accounting Software helps you manage your finances effortlessly.',
                },
            },
            {
                path: 'login',
                loadComponent: () =>
                    import('./web-site-pages/login/login.component').then(
                        (m) => m.LoginComponent
                    ),
                data: {
                    title: 'Login - Ovovex',
                    description: 'Access your Ovovex account to manage your finances.',
                },
            },
            {
                path: 'signup',
                loadComponent: () =>
                    import('./web-site-pages/signup/signup.component').then(
                        (m) => m.SignupComponent
                    ),
                data: {
                    title: 'Sign Up - Ovovex',
                    description: 'Create an account with Ovovex to streamline your accounting process.',
                },
            },
            {
                path: 'verify/:id',
                loadComponent: () =>
                    import('./web-site-pages/verify-link/verify-link.component').then(
                        (m) => m.VerifyLinkComponent
                    ),
                data: {
                    title: 'verify - Ovovex',
                    description: 'Create an account with Ovovex to streamline your accounting process.',
                },
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
                data: {
                    title: 'Dashboard - Ovovex',
                    description: 'View your accounting summary and key financial data on the Ovovex dashboard.',
                },
            },
            {
                path: 'chartofaccounts',
                loadComponent: () =>
                    import('./app-pages/accounts/chart-of-accounts/chart-of-accounts.component').then(
                        (m) => m.ChartOfAccountsComponent
                    ),
                data: {
                    title: 'Chart of Accounts - Ovovex',
                    description: 'Organize your accounts with Ovovex’s Chart of Accounts.',
                },
            },
            {
                path: 'invoice',
                loadComponent: () =>
                    import('./app-pages/invoice/invoice.component').then(
                        (m) => m.InvoiceComponent
                    ),
                data: {
                    title: 'Invoices - Ovovex',
                    description: 'Generate and manage invoices easily with Ovovex.',
                },
            },
            {
                path: 'journal-list',
                loadComponent: () =>
                    import('./app-pages/journal/journal-list/journal-list.component').then(
                        (m) => m.JournalListComponent
                    ),
                data: {
                    title: 'Journal List - Ovovex',
                    description: 'Organize your accounts with Ovovex’s Chart of Accounts.',
                },
            },
            {
                path: 'invoice/invoice-list',
                loadComponent: () =>
                    import('./app-pages/invoice/invoice-list/invoice-list.component').then(
                        (m) => m.InvoiceListComponent
                    ),
                data: {
                    title: 'Invoices - Ovovex',
                    description: 'Generate and manage invoices easily with Ovovex.',
                },
            },
            {
                path: 'invoice/invoice-details/:invoiceId',
                loadComponent: () =>
                    import('./app-pages/invoice/invoice-details/invoice-details.component').then(
                        (m) => m.InvoiceDetailsComponent
                    ),
                data: {
                    title: 'Invoices - Ovovex',
                    description: 'Generate and manage invoices easily with Ovovex.',
                },
            },
            {
                path: 'receipt',
                loadComponent: () =>
                    import('./app-pages/receipt/receipt.component').then(
                        (m) => m.ReceiptComponent
                    ),
                data: {
                    title: 'verify - Ovovex',
                    description: 'Create an account with Ovovex to streamline your accounting process.',
                },
            },

        ],
    },
    {
        path: '**',
        loadComponent: () =>
            import('./web-site-pages/not-found/not-found.component').then(
                (m) => m.NotFoundComponent
            ),
        data: {
            title: 'Page Not Found - Ovovex',
            description: 'The page you are looking for does not exist. Please return to Ovovex.',
        },
    },
];

export const routingConfig = {
    preloadingStrategy: PreloadAllModules,
    initialNavigation: 'enabledBlocking',
};
