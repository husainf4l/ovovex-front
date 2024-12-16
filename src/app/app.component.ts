import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MetaService } from './services/meta.service';
import { Meta, Title } from '@angular/platform-browser';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(
    private meta: Meta,
    private title: Title,
    private metaService: MetaService,
  ) {
    this.initializeMetaTags();
  }




  private initializeMetaTags(): void {
    this.metaService.initMetaTags();

    // Default tags
    this.title.setTitle('Ovovex - Revolutionizing Accounting');
    this.meta.addTags([
      { name: 'description', content: 'Streamline your financial processes with Ovovex.' },
      { name: 'author', content: 'Ovovex Team' },
      { name: 'keywords', content: 'accounting, software, invoices, analytics' },
    ]);
  }
}
