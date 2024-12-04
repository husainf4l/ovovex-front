import { Routes } from '@angular/router';
import { WebsiteLayoutComponent } from './layouts/website-layout/website-layout.component';
import { AppLayoutComponent } from './layouts/app-layout/app-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ChartOfAccountsComponent } from './pages/chart-of-accounts/chart-of-accounts.component';
import { InvoiceComponent } from './pages/invoice/invoice.component';
import { JournalEntryComponent } from './pages/journal-entry/journal-entry.component';
import { AccountStatementComponent } from './pages/account-statement/account-statement.component';
import { LoginComponent } from './web-site-pages/login/login.component';
import { SignupComponent } from './web-site-pages/signup/signup.component';
import { AuthGuard } from './services/auth/auth.guard';
import { HomePageComponent } from './web-site-pages/home-page/home-page.component';

export const routes: Routes = [


    {
        path: '',
        component: WebsiteLayoutComponent,
        children: [
            { path: '', component: HomePageComponent },
            { path: 'login', component: LoginComponent },
            { path: 'signup', component: SignupComponent },
        ],
    },



    {
        path: 'app',
        component: AppLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', component: DashboardComponent },
            { path: 'chartofaccounts', component: ChartOfAccountsComponent },
            { path: 'invoice', component: InvoiceComponent },
            { path: 'journal-entry', component: JournalEntryComponent },
            { path: 'account-statement/:accountId', component: AccountStatementComponent },


        ],
    },
    // { path: '404', component: NotFoundComponent },
    // { path: '**', redirectTo: '404' }


];
