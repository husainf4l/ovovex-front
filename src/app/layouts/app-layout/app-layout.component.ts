import { CommonModule, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-app-layout',
  imports: [RouterOutlet, CommonModule, RouterLink, NgClass, MatIconModule],
  standalone: true,
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.css'
})
export class AppLayoutComponent {
  isSidebarOpen = false;
  isMenueOpen = true;
  isDropdownOpen = false;
  isTransactionHover = false;


  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleAppDropdown() {
    this.isMenueOpen = !this.isMenueOpen;
  }

  toggleTransactionHover(state: boolean) {
    this.isTransactionHover = state;
  }


  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }



}
