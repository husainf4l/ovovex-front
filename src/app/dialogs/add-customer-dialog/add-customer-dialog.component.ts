import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ClientsService } from '../../services/clients.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-customer-dialog',
  templateUrl: './add-customer-dialog.component.html',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatDialogModule,
  ],
})
export class AddCustomerDialogComponent {
  newCustomer = {
    name: '',
    email: '',
    phone: '',
    address: '',
  };
  isLoading = false; // To show loading state
  errorMessage = ''; // To display errors

  constructor(
    public dialogRef: MatDialogRef<AddCustomerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private clientsService: ClientsService // Inject the service
  ) { }

  closeDialog(): void {
    this.dialogRef.close();
  }

  addCustomer(): void {
    if (this.newCustomer.name.trim()) {
      this.isLoading = true;
      this.errorMessage = '';

      // Call the service to save the client
      this.clientsService.createClient(this.newCustomer).subscribe({
        next: (response) => {
          this.isLoading = false;
          // Close the dialog and pass the saved client data
          this.dialogRef.close(response);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Failed to add customer. Please try again.';
          console.error('Error adding customer:', error);
        },
      });
    } else {
      this.errorMessage = 'Customer name is required.';
    }
  }
}
