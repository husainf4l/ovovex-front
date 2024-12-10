import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
  imports: [CommonModule],
})
export class ButtonComponent {
  @Input() isDisabled: boolean = false;
  @Input() buttonText: string = 'Click Me';
  @Input() buttonType: string = 'button';
  @Input() buttonClass: string = '';
  @Input() errorMessage: string | null = null;
  @Output() onClick = new EventEmitter<void>();

  get buttonClasses(): { [key: string]: boolean } {
    return {
      'bg-blue-600 hover:bg-blue-700 cursor-pointer':
        !this.isDisabled && !this.buttonClass,
      'bg-gray-400 cursor-not-allowed': this.isDisabled && !this.buttonClass,
      [this.buttonClass]: !!this.buttonClass,
    };
  }
}
