import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class AddProductComponent implements OnInit {
  productForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private snackBar: MatSnackBar
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      barcode: ['', Validators.required],
      category: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
      costPrice: [0, [Validators.required, Validators.min(0)]],
      salesPrice: [0, [Validators.required, Validators.min(0)]],
      reorderLevel: [0, Validators.min(0)],
      nrv: [null],
      isActive: [true],
    });
  }

  ngOnInit(): void { }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.snackBar.open('Please fill all required fields!', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-error'],
      });
      return;
    }

    this.isLoading = true;
    this.productService.addProduct(this.productForm.value).subscribe({
      next: (response) => {
        this.snackBar.open('Product added successfully!', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success'],
        });
        this.productForm.reset();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error adding product:', err);
        this.snackBar.open('Failed to add product. Try again.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
        this.isLoading = false;
      },
    });
  }
}
