import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CompanyManagementService {
  private baseUrl = 'api/company-management';

  constructor(private http: HttpClient) {}

  getCompanies() {
    return this.http.get(`${this.baseUrl}/companies`);
  }

  getBranches() {
    return this.http.get(`${this.baseUrl}/branches`);
  }

  addCompany(data: any) {
    return this.http.post(`${this.baseUrl}/companies`, data);
  }

  addBranch(data: any) {
    return this.http.post(`${this.baseUrl}/branches`, data);
  }
}
