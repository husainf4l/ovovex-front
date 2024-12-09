import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../../components/app-nav-bar/sidebar/sidebar.component';
import { NavbarComponent } from '../../../components/app-nav-bar/navbar/navbar.component';

@Component({
  selector: 'app-layout',
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    SidebarComponent,
  ], templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {
  isSidebarOpen = false;
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

}
