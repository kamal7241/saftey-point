import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchBarComponent } from '@core/components/search-bar/search-bar.component';
import { TableModule } from '@core/components/tables/table/table.module';
import { CoreTranslationService } from "@core/services/translation.service";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { locale as english } from '../i18n/en';
import { locale as arabic } from '../i18n/ar';
import { BreadcrumbComponentPages } from '@core/components/breadcrumb/breadcrumb-pages.component';
import { Router } from '@angular/router';
import { ButtonComponent } from '@core/components/button/button.component';

@Component({
  selector: 'app-manage-companies',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SearchBarComponent,
    ButtonComponent,
    TableModule,
    TranslateModule,
    BreadcrumbComponentPages
  ],
  templateUrl: './manage-companies.component.html',
})
export class ManageCompaniesComponent implements OnInit {
  breadcrumbs = [
    { label: 'HOME', path: '/' },
    { label: 'COMPANY_MANAGEMENT', path: '/apps/company-management/companies' },
    { label: 'MANAGE_COMPANIES' }
  ];

  
  companies = [
    { id: 1, name: 'Company 1', location: 'New York', status: '1', branches: 5, employees: 120, created: '2023-01-01' },
    { id: 2, name: 'Company 2', location: 'Los Angeles', status: '0', branches: 3, employees: 80, created: '2022-05-10' },
    { id: 3, name: 'Company 3', location: 'Chicago', status: '1', branches: 6, employees: 150, created: '2021-03-23' },
  ];

  headers: string[] = [];

  // Define translation keys
  headerKeys = [
    'COMPANIES.COMPANY_ID',
    'COMPANIES.NAME',
    'COMPANIES.LOCATION',
    'COMPANIES.BRANCHES',
    'COMPANIES.EMPLOYEES',
    'COMPANIES.CREATED',
    'COMPANIES.STATUS',
    'COMMON.ACTIONS'
  ];

  headerMapping = {
    'Company ID': 'companyId',
    'Name': 'name',
    'Location': 'location',
    'Branches': 'branches',
    'Employees': 'employees',
    'Created': 'created',
    'Status': 'status',
  };

  data: any[] = [];

  constructor(
    private _coreTranslationService: CoreTranslationService,
    private translateService: TranslateService,
    private router: Router
  ) {
    this._coreTranslationService.translate(english, arabic);
  }

  ngOnInit() {
    // Translate headers
    this.translateHeaders();

    // Subscribe to language changes
    this.translateService.onLangChange.subscribe(() => {
      this.translateHeaders();
    });

    // Prepare the data
    this.prepareData();
  }

  translateHeaders() {
    // Translate each header key
    Promise.all(this.headerKeys.map(key =>
      this.translateService.get(key).toPromise()
    )).then(translatedHeaders => {
      this.headers = translatedHeaders;
      // Update headerMapping with translated keys
      this.updateHeaderMapping(translatedHeaders);
    });
  }

  updateHeaderMapping(translatedHeaders: string[]) {
    const newHeaderMapping: any = {};
    const originalKeys = ['companyId', 'name', 'location', 'branches', 'employees', 'created', 'status'];

    translatedHeaders.forEach((header, index) => {
      if (index < originalKeys.length) {
        newHeaderMapping[header] = originalKeys[index];
      }
    });

    this.headerMapping = newHeaderMapping;
  }

  prepareData() {
    this.data = this.companies.map((company) => ({
      
      companyId: company.id,
      name: company.name,
      location: company.location,
      branches: company.branches,
      employees: company.employees,
      created: company.created,
      status: this.translateService.instant(`COMMON.STATUS.${company.status.toUpperCase()}`),
      statusCode: company.status,
      actions: {
        edit: () => this.editCompany(company),
        delete: () => this.deleteCompany(company),
        toggle: () => this.toggleCompany(company),
        view: () => this.viewCompany(company),
      },
    }));
  }

  editCompany(company: any) {
    console.log('Editing company:', company);
  }

  deleteCompany(company: any) {
    console.log('Deleting company:', company);
  }

  toggleCompany(company: any) {
    console.log('Toggle company:', company);
  }

  viewCompany(company: any) {
    console.log('view company:', company);
    this.router.navigate([`/apps/company-management/companies/${company.id}`]);

  }
}