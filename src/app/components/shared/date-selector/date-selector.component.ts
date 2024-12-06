import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-date-selector',
  templateUrl: './date-selector.component.html',
  styleUrls: ['./date-selector.component.css'],
  imports: []
})
export class DateSelectorComponent {
  @Input() label: string = 'Date';
  @Input() selectedDate: string = '';
  @Output() selectedDateChange = new EventEmitter<string>();

  onDateChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.selectedDateChange.emit(target.value);
  }
}
