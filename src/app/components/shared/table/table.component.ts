import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-data-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  imports: [CommonModule],
})
export class TableComponent {
  @Input() columns: { label: string; key: string; actions?: { label: string; handler: Function; style?: string }[] }[] = [];
  @Input() data: any[] = [];
}
