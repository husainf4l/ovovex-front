import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.css'],
  imports: [FormsModule, CommonModule],
})
export class SearchInputComponent {
  @Input() items: any[] = [];
  @Input() displayKey: string = '';
  @Input() placeholder: string = 'Search';
  @Input() label: string = '';
  @Output() selected = new EventEmitter<any>();
  @Input() clearOnSelect: boolean = false;
  query: string = '';
  filteredItems: any[] = [];

  onSearch() {
    // Modify the filter to check both `name` and `stock`
    this.filteredItems = this.items.filter(
      (item) =>
        item[this.displayKey]
          ?.toLowerCase()
          .includes(this.query.toLowerCase()) ||
        item['stock']?.toString().includes(this.query) // Include stock in the search criteria
    );
  }

  selectItem(item: any) {
    this.selected.emit(item);
    if (this.clearOnSelect) {
      this.query = '';
    } else {
      this.query = item[this.displayKey];
    }
    this.filteredItems = [];
  }
}
