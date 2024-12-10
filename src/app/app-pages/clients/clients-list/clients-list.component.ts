import { Component } from '@angular/core';
import { ClientsService } from '../../../services/clients.service';
import { Router } from '@angular/router';
import { TableComponent } from "../../../components/shared/table/table.component";

@Component({
  selector: 'app-clients-list',
  imports: [TableComponent],
  templateUrl: './clients-list.component.html',
  styleUrl: './clients-list.component.css'
})
export class ClientsListComponent {
  clientsList: any[] = [];

  constructor(private clientsService: ClientsService, private router: Router) { }

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

  onInvoiceClicked(client: any) {
    this.router.navigate(['/app/account-statement', client.id]);
  }
}
