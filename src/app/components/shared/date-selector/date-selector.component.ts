import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-date-selector',
  templateUrl: './date-selector.component.html',
  styleUrls: ['./date-selector.component.css'],
  imports: [FormsModule],
})
export class DateSelectorComponent {
  @Input() label: string = '';
  @Input() selectedDate: string = ''; // Input for two-way binding
  @Output() selectedDateChange = new EventEmitter<string>(); // Output to emit changes

  onDateChange(event: any): void {
    this.selectedDate = event.target.value;
    this.selectedDateChange.emit(this.selectedDate); // Emit the change to parent
  }
}
