import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthenticationService } from 'app/auth/service';
import { CoreConfigService } from '@core/services/config.service';
import { InputWithLabelComponent } from '@core/components/input-with-label/input-with-label.component';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputWithLabelComponent
  ],
  templateUrl: './forget-password.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ForgetPasswordComponent implements OnInit {
  public forgetPasswordForm: FormGroup;
  public loading = false;
  public submitted = false;
  public successMessage: string = '';
  public errorMessage: string = '';

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _authenticationService: AuthenticationService,
    private _coreConfigService: CoreConfigService
  ) {
    // Configure the layout
    this._coreConfigService.config = {
      layout: {
        navbar: { hidden: true },
        menu: { hidden: true },
        footer: { hidden: true },
        customizer: false,
        enableLocalStorage: false
      }
    };
  }

  ngOnInit(): void {
    this.forgetPasswordForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get f() {
    return this.forgetPasswordForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.forgetPasswordForm.invalid) {
      return;
    }

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const email = this.f.email.value;

    this._authenticationService.forgotPassword({ email }).then((response) => {
      this.loading = false;

      if (response.status) {
        this.successMessage = 'A reset link has been sent to your email address.';
        // Store email temporarily if needed on the OTP page
        localStorage.setItem('resetEmail', email);
  
        // Navigate to the OTP page
        this._router.navigate(['/pages/authentication/otp']);
      } else {
        this.errorMessage = response.message || 'An error occurred. Please try again later.';
      }
    }).catch((error) => {
      this.loading = false;
      this.errorMessage = error.message || 'An error occurred. Please try again later.';
    });
  }
}
