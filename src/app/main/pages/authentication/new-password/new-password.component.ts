import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  QueryList,
  ViewChildren,
  ElementRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthenticationService } from 'app/auth/service';
import { CoreConfigService } from '@core/services/config.service';

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-password.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class NewPasswordComponent implements OnInit, OnDestroy {
  public passwordForm: FormGroup;
  public loading = false;
  public submitted = false;
  public errorMessage: string = '';

  // Timer variables
  public timeLeft: number = 10;
  public timerText: string = 'You can resend the code within 0:59 seconds';
  public canResend: boolean = false;
  private interval: any;

  @ViewChildren('passwordInput') passwordInputs!: QueryList<ElementRef>;

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _authenticationService: AuthenticationService,
    private _coreConfigService: CoreConfigService
  ) {
    this._coreConfigService.config = {
      layout: {
        navbar: { hidden: true },
        menu: { hidden: true },
        footer: { hidden: true },
        customizer: false,
        enableLocalStorage: false,
      },
    };
  }

  ngOnInit(): void {
    this.passwordForm = this._formBuilder.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    }, {
      validator: this.passwordMatchValidator
    });

  }

  ngOnDestroy(): void {
    // Clear the timer when the component is destroyed
    clearInterval(this.interval);
  }

  passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    return form.get('newPassword')?.value === form.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }


  onInput(event: KeyboardEvent, index: number): void {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.value && index < 1) {
      this.passwordInputs.toArray()[index + 1].nativeElement.focus();
    }

    if (!inputElement.value && event.key === 'Backspace' && index > 0) {
      this.passwordInputs.toArray()[index - 1].nativeElement.focus();
    }
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.passwordForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const { newPassword } = this.passwordForm.value;

    this._authenticationService
      .resetPassword({ newPassword: newPassword })
      .then((response) => {
        this.loading = false;

        if (response.status) {
          this._router.navigate(['/pages/authentication/login']);
        } else {
          this.errorMessage = response.message || 'Failed to reset the password!';
        }
      })
      .catch((error) => {
        this.loading = false;
        this.errorMessage =
          error.message || 'An error occurred while resetting the password.';
      });
  }
}
