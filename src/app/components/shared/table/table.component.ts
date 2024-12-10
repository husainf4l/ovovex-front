import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-data-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  imports: [CommonModule],
})
export class TableComponent {
  @Input() columns: {
    label: string;
    key: any;
    actions?: { label: string; handler: Function; style?: string }[];
  }[] = [];
  @Input() data: any[] = [];
  @Output() rowClicked: EventEmitter<any> = new EventEmitter();

  onRowClick(row: any) {
    this.rowClicked.emit(row); // Emit the selected row data
  }

  // Optional: You can add a method to handle any custom actions you want to add for rows
  handleAction(action: any, row: any) {
    if (action.handler) {
      action.handler(row);
    }
  }
}
