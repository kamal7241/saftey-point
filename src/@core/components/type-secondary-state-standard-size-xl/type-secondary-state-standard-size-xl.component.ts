import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule here

@Component({
  selector: 'app-type-secondary-state-standard-size-xl',
  standalone: true,
  templateUrl: './type-secondary-state-standard-size-xl.component.html',
  imports: [CommonModule]  // Add CommonModule to the imports array
})
export class TypeSecondaryStateStandardSizeXlComponent {
  @Input() label: string = '';
  @Input() type: string = 'Primary';
  @Input() state: string = 'Standard';
  @Input() size: string = 'Medium';
  @Input() leftIcon: boolean = false;
  @Input() rightIcon: boolean = false;
}
