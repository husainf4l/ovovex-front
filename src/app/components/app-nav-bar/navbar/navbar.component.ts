import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserDropdownComponent } from './user-dropdown/user-dropdown.component';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, UserDropdownComponent, MatIcon, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  @Input() userData: any;
  @Output() toggleSidebar = new EventEmitter<void>();
  @Input() isSidebarOpen = false;

  constructor(public themeService: ThemeService) { }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

}
