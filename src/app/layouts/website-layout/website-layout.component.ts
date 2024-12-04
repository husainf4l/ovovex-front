import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./navbar/navbar.component";
import { HeroComponent } from "../../web-site-pages/home-page/hero/hero.component";
import { SmartFeaturesComponent } from "../../web-site-pages/home-page/smart-features/smart-features.component";
import { HomePageComponent } from "../../web-site-pages/home-page/home-page.component";

@Component({
  selector: 'app-website-layout',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './website-layout.component.html',
  styleUrl: './website-layout.component.css'
})
export class WebsiteLayoutComponent {

}
