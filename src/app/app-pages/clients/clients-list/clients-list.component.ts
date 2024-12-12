import { Component } from '@angular/core';
import { ClientsService } from '../../../services/clients.service';
import { Router } from '@angular/router';
import { TableComponent } from "../../../components/shared/table/table.component";
import { MatDialog } from '@angular/material/dialog';
import { AddCustomerDialogComponent } from '../../../components/dialogs/add-customer-dialog/add-customer-dialog.component';

@Component({
  selector: 'app-clients-list',
  imports: [TableComponent],
  templateUrl: './clients-list.component.html',
  styleUrl: './clients-list.component.css'
})
export class ClientsListComponent {
  clientsList: any[] = [];

  constructor(private clientsService: ClientsService, private router: Router, private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getReceipts();
  }

  getReceipts(): void {
    this.clientsService.getClients().subscribe((data) => {
      this.clientsList = data;
    });
  }

  columns: { label: string; key: string }[] = [
    { label: 'hierarchyCode', key: 'hierarchyCode' },
    { label: 'Name', key: 'name' },
    { label: 'currentBalance', key: 'currentBalance' },
  ];

  openAddCustomerDialog(): void {
    const dialogRef = this.dialog.open(AddCustomerDialogComponent, {
      width: '400px',
      disableClose: true,
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Customer added:', result);
      }
    });
  }

  onInvoiceClicked(client: any) {
    this.router.navigate(['/app/account-statement', client.id]);
  }
}
