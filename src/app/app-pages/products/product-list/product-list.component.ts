import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableComponent } from '../../../components/shared/table/table.component';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  imports: [CommonModule, TableComponent],
})
export class ProductListComponent implements OnInit {
  products: any[] = [];

  constructor(private productService: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
    });
  }

  columns: { label: string; key: string }[] = [
    { label: 'Barcode', key: 'barcode' },
    { label: 'Item name', key: 'name' },
    { label: 'Cost price', key: 'costPrice' },
    { label: 'Sales price', key: 'salesPrice' },
    { label: 'Stock', key: 'stock' },
    { label: 'total', key: 'totalCost' },
  ];

  onInvoiceClicked(product: any) {
    this.router.navigate(['/app/invoice/invoice-details', product.id]);
  }
}
