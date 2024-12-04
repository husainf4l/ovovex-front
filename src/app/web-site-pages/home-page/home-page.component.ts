import { Component } from '@angular/core';
import { HeroComponent } from "./hero/hero.component";
import { SmartFeaturesComponent } from "./smart-features/smart-features.component";

@Component({
  selector: 'app-home-page',
  imports: [HeroComponent, SmartFeaturesComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

}
