import { Routes } from '@angular/router';
import { WebsiteLayoutComponent } from './layouts/website-layout/website-layout.component';
import { AppLayoutComponent } from './layouts/app-layout/app-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ChartOfAccountsComponent } from './pages/chart-of-accounts/chart-of-accounts.component';
import { InvoiceComponent } from './pages/invoice/invoice.component';
import { JournalEntryComponent } from './pages/journal-entry/journal-entry.component';

export const routes: Routes = [


    {
        path: '',
        component: WebsiteLayoutComponent,
        children: [
            { path: '', component: WebsiteLayoutComponent },




        ],
    },
    {
        path: 'app',
        component: AppLayoutComponent,
        children: [
            { path: '', component: DashboardComponent },
            { path: 'chartofaccounts', component: ChartOfAccountsComponent },
            { path: 'invoice', component: InvoiceComponent },
            { path: 'journal-entry', component: JournalEntryComponent },

        ],
    },
    // { path: '404', component: NotFoundComponent },
    // { path: '**', redirectTo: '404' }


];
