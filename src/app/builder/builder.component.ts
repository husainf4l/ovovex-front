import { Component, OnInit } from '@angular/core';
import grapesjs from 'grapesjs';

@Component({
  selector: 'app-builder',
  imports: [],
  templateUrl: './builder.component.html',
  styleUrl: './builder.component.css',
})
export class BuilderComponent implements OnInit {
  ngOnInit() {
    grapesjs.init({
      container: '#editor',
      plugins: ['gjs-preset-webpage'],
    });
  }
}
