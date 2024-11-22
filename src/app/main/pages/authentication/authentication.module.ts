import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CoreCommonModule } from '@core/common.module';

import { AuthLoginComponent } from 'app/main/pages/authentication/auth-login/auth-login.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { OtpComponent } from './otp/otp.component';
import { NewPasswordComponent } from './new-password/new-password.component';

// routing
const routes: Routes = [
  {
    path: 'authentication/login',
    component: AuthLoginComponent,
    data: { animation: 'auth' }
  },
  {
    path: 'authentication/forget',
    component: ForgetPasswordComponent,
    data: { animation: 'auth' }
  },
  {
    path: 'authentication/otp',
    component: OtpComponent,
    data: { animation: 'auth' }
  },
  {
    path: 'authentication/reset',
    component: NewPasswordComponent,
    data: { animation: 'auth' }
  }
];

@NgModule({
  // declarations: [AuthLoginComponent],
  imports: [CommonModule, RouterModule.forChild(routes), NgbModule, FormsModule, ReactiveFormsModule, CoreCommonModule, AuthLoginComponent, ForgetPasswordComponent, OtpComponent]
})
export class AuthenticationModule { }
