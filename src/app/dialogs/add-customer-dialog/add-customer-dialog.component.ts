import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-customer-dialog',
  templateUrl: './add-customer-dialog.component.html',
  imports: [FormsModule]
})
export class AddCustomerDialogComponent {
  newCustomer = { name: '', contact: '' };

  constructor(
    public dialogRef: MatDialogRef<AddCustomerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  closeDialog(): void {
    this.dialogRef.close();
  }

  addCustomer(): void {
    if (this.newCustomer.name.trim()) {
      this.dialogRef.close(this.newCustomer);
    }
  }
}
