import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserDropdownComponent } from './user-dropdown/user-dropdown.component';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../../services/theme.service';
import { CompanySelectDialogComponent } from '../../company-select-dialog/company-select-dialog.component';
import { MatDialog } from '@angular/material/dialog';

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

  constructor(public themeService: ThemeService, private dialog: MatDialog) { }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  openCompanySelectionDialog(): void {
    const dialogRef = this.dialog.open(CompanySelectDialogComponent, {
      width: '400px',
      disableClose: true, // Optional: Prevents closing on outside click
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog result:', result);
    });
  }

}
