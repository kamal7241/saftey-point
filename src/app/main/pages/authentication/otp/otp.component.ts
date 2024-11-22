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
  selector: 'app-otp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './otp.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class OtpComponent implements OnInit, OnDestroy {
  public otpForm: FormGroup;
  public loading = false;
  public submitted = false;
  public errorMessage: string = '';

  public codes = [0, 1, 2, 3, 4, 5];

  // Timer variables
  public timeLeft: number = 10;
  public timerText: string = 'You can resend the code within 0:59 seconds';
  public canResend: boolean = false;
  private interval: any;

  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

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
    this.otpForm = this._formBuilder.group({
      code0: ['', [Validators.required, Validators.maxLength(1)]],
      code1: ['', [Validators.required, Validators.maxLength(1)]],
      code2: ['', [Validators.required, Validators.maxLength(1)]],
      code3: ['', [Validators.required, Validators.maxLength(1)]],
      code4: ['', [Validators.required, Validators.maxLength(1)]],
      code5: ['', [Validators.required, Validators.maxLength(1)]],
    });

    // Start the timer
    this.startTimer();
  }

  ngOnDestroy(): void {
    // Clear the timer when the component is destroyed
    clearInterval(this.interval);
  }

  startTimer(): void {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timerText = `You can resend the code within ${minutes}:${seconds
          .toString()
          .padStart(2, '0')} seconds`;
      } else {
        clearInterval(this.interval);
        this.canResend = true;
        this.timerText = '';
      }
    }, 1000);
  }

  onInput(event: KeyboardEvent, index: number): void {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.value && index < this.codes.length - 1) {
      this.otpInputs.toArray()[index + 1].nativeElement.focus();
    }

    if (!inputElement.value && event.key === 'Backspace' && index > 0) {
      this.otpInputs.toArray()[index - 1].nativeElement.focus();
    }
  }

  resendCode(): void {
    this.canResend = false;
    this.timeLeft = 59;
    this.timerText = 'You can resend the code within 0:59 seconds';
    this.startTimer();

    this._authenticationService.resendOtp().then((response) => {
      if (response.status) {
        console.log('OTP resent successfully!');
      } else {
        this.errorMessage = response.message || 'Failed to resend OTP!';
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.otpForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const otpCode = Object.values(this.otpForm.value).join('');

    this._authenticationService
      .verifyOtp({ otp: otpCode })
      .then((response) => {
        this.loading = false;

        if (response.status) {
          this._router.navigate(['/pages/authentication/reset']);
        } else {
          this.errorMessage = response.message || 'Invalid OTP!';
        }
      })
      .catch((error) => {
        this.loading = false;
        this.errorMessage =
          error.message || 'An error occurred while verifying the OTP.';
      });
  }
}
