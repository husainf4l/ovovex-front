import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainNavbarComponent } from "./navbar/navbar.component";

@Component({
  selector: 'app-website-layout',
  imports: [RouterOutlet, MainNavbarComponent],
  templateUrl: './website-layout.component.html',
  styleUrl: './website-layout.component.css'
})
export class WebsiteLayoutComponent {

}
