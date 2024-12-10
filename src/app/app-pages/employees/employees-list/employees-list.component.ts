import { Component } from '@angular/core';
import { EmployeesService } from '../../../services/employees.service';
import { Router } from '@angular/router';
import { TableComponent } from "../../../components/shared/table/table.component";

@Component({
  selector: 'app-employees-list',
  imports: [TableComponent],
  templateUrl: './employees-list.component.html',
  styleUrl: './employees-list.component.css'
})
export class EmployeesListComponent {
  emplyeesList: any[] = [];

  constructor(private employeesService: EmployeesService, private router: Router) { }

  ngOnInit(): void {
    this.getReceipts();
  }

  getReceipts(): void {
    this.employeesService.getEmployeesList().subscribe((data) => {
      this.emplyeesList = data;
    });
  }

  columns: { label: string; key: string }[] = [
    { label: 'Name', key: 'displayName' },
    { label: 'id', key: 'id' },

  ];

  onInvoiceClicked(employees: any) {
    this.router.navigate(['/app/invoice/invoice-details', employees.id]);
  }
}

