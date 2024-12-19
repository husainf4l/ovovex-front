import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SearchInputComponent } from '../../components/shared/search-input/search-input.component';
import { DropdownComponent } from '../../components/shared/dropdown/dropdown.component';
import { TableComponent } from '../../components/shared/table/table.component';
import { TotalsComponent } from '../../components/shared/totals/totals.component';
import { DateSelectorComponent } from '../../components/shared/date-selector/date-selector.component';
import { ButtonComponent } from '../../components/shared/button/button.component';
import { Product, PurchaseProduct, Supplier } from '../../models/purchase.model';
import { PurchaseService } from '../../services/purchase.service';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css'],
  imports: [
    FormsModule,
    CommonModule,
    SearchInputComponent,
    DateSelectorComponent,
    TableComponent,
    ButtonComponent,
  ],
})
export class PurchaseComponent implements OnInit {
  // @ViewChild(PurchasePrintComponent)
  // purchasePrintComponent!: PurchasePrintComponent;

  suppliers: Supplier[] = [];
  filteredSuppliers: Supplier[] = [];
  selectedSupplier: Supplier | null = null;
  searchQuery: string = '';
  products: Product[] = [];
  filteredProducts: Product[] = [];
  productSearchQuery: string = '';
  purchaseProducts: PurchaseProduct[] = [];
  subtotal: number = 0;
  vatAmount: number = 0;
  grandTotal: number = 0;
  taxRate: number = 16;
  purchaseDate: string = new Date().toISOString();
  number: number = 0;
  userData: any;

  constructor(
    private dialog: MatDialog,
    private purchaseService: PurchaseService
  ) { }

  ngOnInit(): void {
    this.fetchData();
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      try {
        this.userData = JSON.parse(userDataString);
      } catch (error) {
        console.error('Error parsing userData:', error);
      }
    }
  }

  fetchData(): void {
    this.purchaseService.getPurchaseData().subscribe({
      next: (data) => {
        this.products = data.products;
        this.suppliers = data.suppliers;
        this.filteredSuppliers = [...this.suppliers];
        this.filteredProducts = [...this.products];
        // this.number = data.number;
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      },
    });
  }

  filterSuppliers(): void {
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredSuppliers = this.suppliers.filter((supplier) =>
      supplier.name?.toLowerCase().includes(query)
    );
  }

  selectSupplier(supplier: Supplier): void {
    this.selectedSupplier = supplier;
    this.searchQuery = supplier.name;
    this.filteredSuppliers = [];
  }

  filterProducts(): void {
    const query = this.productSearchQuery.toLowerCase().trim();
    this.filteredProducts = this.products.filter(
      (product) =>
        product.name?.toLowerCase().includes(query) ||
        product.barcode.includes(query)
    );
  }

  selectProduct(product: Product): void {
    this.purchaseProducts.push({
      id: product.id,
      barcode: product.barcode,
      name: product.name,
      quantity: 1,
      costPrice: product.costPrice,
      total: product.costPrice,
    });
    this.productSearchQuery = '';
    this.filteredProducts = [];
    this.updateTotals();
  }

  removeProduct(id: string): void {
    this.purchaseProducts = this.purchaseProducts.filter(
      (product) => product.id !== id
    );
    this.updateTotals();
  }

  updateTotal(product: PurchaseProduct): void {
    product.total = product.quantity * product.costPrice;
    this.updateTotals();
  }

  updateTotals(): void {
    this.subtotal = this.purchaseProducts.reduce(
      (sum, product) => sum + product.total,
      0
    );
    this.vatAmount = (this.subtotal * this.taxRate) / 100;
    this.grandTotal = this.subtotal + this.vatAmount;
  }

  // openAddSupplierDialog(): void {
  //   const dialogRef = this.dialog.open(AddSupplierDialogComponent, {
  //     width: '400px',
  //     disableClose: true,
  //     data: {},
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       console.log('Supplier added:', result);
  //       this.suppliers.push(result.supplier);
  //       this.selectSupplier(result.supplier);
  //     }
  //   });
  // }

  savePurchase(): void {
    if (!this.selectedSupplier || this.purchaseProducts.length === 0) {
      alert('Please complete all required fields before saving the purchase.');
      return;
    }

    const purchaseData = {
      supplierId: this.selectedSupplier.id,
      supplierName: this.selectedSupplier.name,
      issueDate: this.purchaseDate,
      number: this.number,
      items: this.purchaseProducts.map((product) => ({
        name: product.name,
        productId: product.id,
        quantity: product.quantity,
        unitPrice: product.costPrice,
        totalAmount: product.total,
      })),
      taxExclusiveAmount: this.subtotal,
      taxAmount: this.vatAmount,
      taxInclusiveAmount: this.grandTotal,
    };

    this.purchaseService.createPurchase(purchaseData).subscribe({
      next: (response) => {
        console.log('Purchase submitted successfully:', response);
        alert('Purchase saved successfully.');
        window.location.reload();
      },
      error: (err) => {
        console.error('Error saving purchase:', err);
        alert('Failed to save the purchase. Please try again.');
      },
    });
  }

  printPurchase(): void {
    // this.purchasePrintComponent.printPurchase();
  }
}
