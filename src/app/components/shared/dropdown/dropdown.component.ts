// components/invoice/dropdown/dropdown.component.ts
import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],
  imports: [FormsModule, CommonModule]
})
export class DropdownComponent {
  @Input() label: string = '';
  @Input() options: { value: any; label: string }[] = [];
  @Input() selectedValue: any; // The current value of the dropdown

  @Output() selectedValueChange = new EventEmitter<any>(); // For two-way binding

  onChange(event: any) {
    this.selectedValue = event.target.value;
    this.selectedValueChange.emit(this.selectedValue); // Emit the new value
  }
}
