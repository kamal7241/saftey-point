import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { InputWithLabelComponent } from '@core/components/input-with-label/input-with-label.component';
import { CoreConfigService } from '@core/services/config.service';
import { AuthenticationService } from 'app/auth/service';

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputWithLabelComponent
  ],
  templateUrl: './new-password.component.html',
  encapsulation: ViewEncapsulation.None
})
export class NewPasswordComponent implements OnInit {
  // Public
  public coreConfig: any;
  public passwordForm: UntypedFormGroup;
  public loading = false;
  public submitted = false;
  public returnUrl: string;
  public error = '';
  public passwordTextType: boolean;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {UntypedFormBuilder} _formBuilder
   * @param {ActivatedRoute} _route
   * @param {Router} _router
   * @param {AuthenticationService} _authenticationService
   */
  constructor(
    private _coreConfigService: CoreConfigService,
    private _formBuilder: UntypedFormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _authenticationService: AuthenticationService
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

  // Convenience getter for easy access to form fields
  get f() {
    return this.passwordForm.controls;
  }

  /**
   * Toggle password visibility
   */
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  /**
   * Submit form
   */
  onSubmit() {
    this.submitted = true;
    if (this.passwordForm.invalid) {
      return;
    }
    this.loading = true;

    // Handle password reset logic here
    const request = {
      newPassword: this.f.newPassword.value,
      confirmPassword: this.f.confirmPassword.value
    };

    this._authenticationService.resetPassword(request).then((response) => {
      this.loading = false;
      if (response.status) {
        this._router.navigate([this.returnUrl]);
        this.error = response.message;
      } else {
        this.error = response.message;
      }
    });
  }

  /**
   * On init
   */
  ngOnInit(): void {
    this.passwordForm = this._formBuilder.group(
      {
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/
            )
          ]
        ],
        confirmPassword: ['', Validators.required]
      },
      {
        validators: this.passwordMatchValidator // Add custom validator to form group level
      }
    );

    // get return url from route parameters or default to '/'
    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/dashboard';
    
    // Subscribe to config changes
    this._coreConfigService.config.subscribe(config => {
      this.coreConfig = config;
    });
  }

  /**
   * Custom Validator to check if passwords match
   */
  passwordMatchValidator(formGroup: UntypedFormGroup): { [key: string]: boolean } | null {
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      return { mismatch: true }; // Return mismatch error if passwords don't match
    }
    return null; // Return null if passwords match
  }
}
