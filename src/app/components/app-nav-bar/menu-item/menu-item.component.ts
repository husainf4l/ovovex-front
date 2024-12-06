import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css'],
  imports: [RouterLink, MatIcon, CommonModule]
})
export class MenuItemComponent {
  @Input() icon!: string | null; // Material icon name
  @Input() label!: string; // Menu item label
  @Input() routerLink: string | null = null; // Router link
  @Input() isExpandable = false; // If the item is expandable
  isExpanded = false; // Expand/collapse state for expandable items

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }
}
