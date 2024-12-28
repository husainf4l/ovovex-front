import { Component, OnInit } from '@angular/core';
import { ClientsService } from '../../../services/clients.service';
import { Router } from '@angular/router';
import { TableComponent } from "../../../components/shared/table/table.component";
import { MatDialog } from '@angular/material/dialog';
import { AddCustomerDialogComponent } from '../../../components/dialogs/add-customer-dialog/add-customer-dialog.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-clients-list',
  imports: [FormsModule, CommonModule],
  templateUrl: './clients-list.component.html',
  styleUrl: './clients-list.component.css'
})
export class ClientsListComponent implements OnInit {
  clients: any[] = [];
  filteredClients: any[] = [];
  searchQuery: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 100;
  totalPages: number = 0;

  constructor(private clientsService: ClientsService, private router: Router) { }

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientsService.getClients().subscribe({
      next: (response: { clients: any[] }) => {
        if (response?.clients) {
          this.clients = response.clients; // Access the clients array
          this.filteredClients = this.clients;
          this.totalPages = Math.ceil(this.filteredClients.length / this.itemsPerPage);
        } else {
          console.error('Invalid response format:', response);
          this.clients = [];
          this.filteredClients = [];
          this.totalPages = 0;
        }
      },
      error: (err) => {
        console.error('Error loading clients:', err);
      },
    });
  }



  searchClients(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredClients = this.clients.filter(
      (client) =>
        client.name.toLowerCase().includes(query) ||
        client.email?.toLowerCase().includes(query) ||
        client.phone?.includes(query) ||
        client.taxId?.includes(query)
    );
    this.totalPages = Math.ceil(this.filteredClients.length / this.itemsPerPage);
    this.currentPage = 1; // Reset to the first page
  }

  paginate(array: any[], pageNumber: number, pageSize: number): any[] {
    const startIndex = (pageNumber - 1) * pageSize;
    return array.slice(startIndex, startIndex + pageSize);
  }

  get paginatedClients(): any[] {
    return this.paginate(this.filteredClients, this.currentPage, this.itemsPerPage);
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  viewClientDetails(clientId: string): void {
    this.router.navigate(['app/client-details', clientId]);
  }
}
