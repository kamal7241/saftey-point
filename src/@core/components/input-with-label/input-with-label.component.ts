import { Component, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-input-with-label',
  standalone: true,
  imports: [CommonModule,MatIconModule],
  templateUrl: './input-with-label.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: InputWithLabelComponent,
    multi: true
  }]
})
export class InputWithLabelComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() type: string = 'text'; // Default input type
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() formControlName: string = '';
  @Input() icon: string = '';

  value: string = '';
  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  isPasswordVisible: boolean = false; // State for password visibility

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setValue(value: string) {
    this.value = value;
    this.onChange(value);
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.setValue(input.value);
  }
}
