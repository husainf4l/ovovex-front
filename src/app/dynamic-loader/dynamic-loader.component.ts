import { Component, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-dynamic-loader',
  template: `<div #container></div>`,
})
export class DynamicLoaderComponent {
  @ViewChild('container', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;

  loadComponent(component: any): void {
    this.container.clear(); // Clear any existing components in the container
    this.container.createComponent(component);
  }
}
