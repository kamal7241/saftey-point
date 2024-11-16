import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { takeUntil, first } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { AuthenticationService } from 'app/auth/service';
import { CoreConfigService } from '@core/services/config.service';
import { InputWithLabelComponent } from '@core/components/input-with-label/input-with-label.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputWithLabelComponent // Import the InputWithLabelComponent
  ],
  templateUrl: './auth-login.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AuthLoginComponent implements OnInit {
  //  Public
  public coreConfig: any;
  public loginForm: UntypedFormGroup;
  public loading = false;
  public submitted = false;
  public returnUrl: string;
  public error = '';
  public passwordTextType: boolean;


  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
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
        navbar: {
          hidden: true
        },
        menu: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        customizer: false,
        enableLocalStorage: false
      }
    };
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  /**
   * Toggle password
   */
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    const request = {
      // email: this.f.email.value,
      username: this.f.email.value,
      password: this.f.password.value,
      userType: 3
    }
    this._authenticationService.requestLogin(request).then((response) => {
      this.loading = false;
      console.log(response);
      if (response.status) {
        localStorage.setItem('authToken', response.authToken);
        this._router.navigate([this.returnUrl]);
        this.error = response.message;
      } else {
        this.error = response.message
      }
    })
  }
  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      email: ['e', [Validators.required, Validators.email]],
      password: ['Test1234', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/dashboard';

    // Subscribe to config changes
    this._coreConfigService.config.subscribe(config => {
      this.coreConfig = config;
    });
  }
}
