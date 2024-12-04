import { CommonModule, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-app-layout',
  imports: [RouterOutlet, CommonModule, RouterLink, NgClass, MatIconModule],
  standalone: true,
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.css'
})
export class AppLayoutComponent implements OnInit {
constructor(private authService:AuthService){}
  isSidebarOpen = false;
  isMenueOpen = true;
  isDropdownOpen = false;
  isTransactionHover = false;

  userData: any;


  ngOnInit(): void {
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      try {
        this.userData = JSON.parse(userDataString);
      } catch (error) {
        console.error('Error parsing userData:', error);
      }
    }
  }

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

logout(){
this.authService.logout();
}


}
