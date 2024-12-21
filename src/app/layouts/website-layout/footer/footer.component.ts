import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  selectedRegion: string = 'Jordan'; // Default region
  isDropdownOpen: boolean = false; // Dropdown state
  regions: string[] = ['Jordan', 'Romania', 'UAE', 'KSA']; // List of regions

  // Toggles the dropdown
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Handles region selection
  selectRegion(region: string) {
    this.selectedRegion = region;
    this.isDropdownOpen = false;
    console.log(`Region changed to: ${region}`);
    // Additional logic (e.g., save to local storage or API call) can be added here
  }

}
