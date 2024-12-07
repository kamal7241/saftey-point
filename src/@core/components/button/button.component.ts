import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './button.component.html',
})
export class ButtonComponent {
  @Input() label: string = '';
  @Input() icon?: string;
  @Input() bgColor: string = 'bg-white'; // default color
  @Input() textColor: string = 'text-primary hover:bg-primary hover:text-white'; // default text color
  @Input() borderColor: string = 'border border-transparent'; // default border color
  @Input() padding: string = 'px-4 py-2'; // default padding
  @Input() borderRadius: string = 'rounded-lg'; // default border radius
  @Input() isTransparent: boolean = false; // transparent background flag
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  // Dynamically computed classes
  buttonClasses: any = {};

  ngOnInit() {
    this.updateButtonClasses();
  }

  // Update button classes dynamically
  updateButtonClasses() {
    this.buttonClasses = {
      [this.bgColor]: !this.isTransparent,
      'bg-transparent': this.isTransparent,
      [this.textColor]: true,
      [this.borderColor]: true,
      [this.padding]: true,
      [this.borderRadius]: true
    };
  }

  onClick() {
    console.log('Button clicked!');
  }
}
