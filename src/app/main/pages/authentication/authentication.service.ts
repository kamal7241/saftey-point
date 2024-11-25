import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '@core/services/api.service';
import { ApiResult } from '@core/types/api-result';
import { BehaviorSubject } from 'rxjs';
import { UserLoginData } from './interfaces/user-login';

@Injectable({ providedIn: 'root' })
export class AuthenticationService extends ApiService {
  userData$: BehaviorSubject<UserLoginData | null> = new BehaviorSubject(null);

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   * @param {ToastrService} _toastrService
   */
  constructor(
    private _httpClient: HttpClient,
    private _toastrService: ToastrService,
  ) {
    super(_httpClient, _toastrService);
    this.getUserData();
  }

  // Existing Methods
  requestLogin(request: any): Promise<ApiResult<any>> {
    return this.postResponse('auth/login', request);
  }

  requestForgetPassword(request: any): Promise<ApiResult<any>> {
    return this.postResponse('auth/forget-password', request);
  }

  requestRegisterInstructor(request: any): Promise<ApiResult<any>> {
    return this.postResponse('admin/register', request);
  }

  // New forgotPassword method
  forgotPassword(request: any): Promise<ApiResult<any>> {
    return this.postResponse('c/c5f9-0bcb-42ac-83cd', request);
  }

  verifyOtp(request: { otp: string }): Promise<ApiResult<any>> {
    return this.postResponse('c/c5f9-0bcb-42ac-83cd', request);
  }

  resendOtp(): Promise<ApiResult<any>> {
    return this.postResponse('c/c5f9-0bcb-42ac-83cd');
  }

  // Updated resetPassword method with explicit typing for Promise<ApiResult<any>>
  resetPassword(request: { newPassword: string }): Promise<ApiResult<any>> {
    return new Promise<ApiResult<any>>((resolve, reject) => {
      // Simulating a delay for a mock API response
      setTimeout(() => {
        const mockResponse: ApiResult<any> = {
          code: 200, // Example code, adjust to your needs
          status: true, // Toggle for success (true) or failure (false)
          innerData: null, // Add any data if required, null for now
          message: 'Password updated successfully!', // Custom message
          authToken: 'fake-auth-token' // Example auth token, if applicable
        };
  
        // Fake success/failure response based on status
        if (mockResponse.status) {
          this._toastrService.success(mockResponse.message, 'Success');
          resolve(mockResponse);
        } else {
          this._toastrService.error(mockResponse.message, 'Error');
          reject(mockResponse);
        }
      }, 1000); // Simulate a 1-second delay (adjust as needed)
    }).catch(error => {
      // Handle network or other errors
      this._toastrService.error('An error occurred while resetting your password.', 'Error');
      throw error;
    });
  }

  getUserData(): void {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      this.userData$.next(userData);
    } else {
      this.userData$.next(null);
    }
  }

  getToken(): string {
    const token = localStorage.getItem('authToken');
    return token && token !== 'undefined' ? token : '';
  }

  logout(): void {
    this.userData$.next(null);
    localStorage.clear();
  }
}
