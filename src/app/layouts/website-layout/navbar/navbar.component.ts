import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../components/shared/button/button.component';
import { ThemeService } from '../../../services/theme.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, MatIcon],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class MainNavbarComponent {
  constructor(public themeService: ThemeService) {}

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
