import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LogoComponent } from '../sidebar/logo/logo.component';
import { UserDropdownComponent } from './user-dropdown/user-dropdown.component';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, UserDropdownComponent, MatIcon],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  @Input() userData: any;
  @Output() toggleSidebar = new EventEmitter<void>();
  @Input() isSidebarOpen = false;


}
