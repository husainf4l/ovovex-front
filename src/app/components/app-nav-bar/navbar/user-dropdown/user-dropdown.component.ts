import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AuthService } from '../../../../services/auth/auth.service';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../../../services/theme.service';

@Component({
  selector: 'app-user-dropdown',
  standalone: true,
  templateUrl: './user-dropdown.component.html',
  styleUrls: ['./user-dropdown.component.css'],
  imports: [CommonModule, RouterLink]
})
export class UserDropdownComponent {
  constructor(private authService: AuthService, private themeService: ThemeService) { }

  @Input() userData: any;
  isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout() {
    this.authService.logout();
  }


}
