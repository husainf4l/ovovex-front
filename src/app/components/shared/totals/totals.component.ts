// components/invoice/totals/totals.component.ts
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-invoice-totals',
  templateUrl: './totals.component.html',
  styleUrls: ['./totals.component.css'],
  imports: [CommonModule]
})
export class TotalsComponent {
  @Input() subtotal: number = 0;
  @Input() vatAmount: number = 0;
  @Input() grandTotal: number = 0;
  @Input() taxRate: number = 0;
}
