import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from "./navbar/navbar.component";
import { HeroComponent } from "./hero/hero.component";
import { SmartFeaturesComponent } from "./smart-features/smart-features.component";

@Component({
  selector: 'app-website-layout',
  imports: [NavbarComponent, HeroComponent, SmartFeaturesComponent],
  templateUrl: './website-layout.component.html',
  styleUrl: './website-layout.component.css'
})
export class WebsiteLayoutComponent {

}
