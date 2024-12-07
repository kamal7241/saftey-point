import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbComponentPages } from '@core/components/breadcrumb/breadcrumb-pages.component';
import { TranslateModule } from '@ngx-translate/core';

// Import translation data for English and Arabic
import { locale as english } from '../i18n/en';
import { locale as arabic } from '../i18n/ar';
// Import the translation service
import { CoreTranslationService } from '@core/services/translation.service';

@Component({
  selector: 'app-view-company',
  templateUrl: './company-details.component.html',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponentPages, TranslateModule]
})
export class CompanyDetailsComponent implements OnInit {
  breadcrumbs = [
    { label: 'HOME', path: '/' },
    { label: 'COMPANY_MANAGEMENT', path: '/apps/company-management/companies' },
    { label: 'COMPANY_DETAILS' }
  ];
  companyId: number | null = null;
  companyDetails: any = null;

  constructor(
    private route: ActivatedRoute,
    private _coreTranslationService: CoreTranslationService // Inject the translation service
  ) {}

  ngOnInit() {
    // Initialize the translation for English and Arabic
    this._coreTranslationService.translate(english, arabic);

    this.route.paramMap.subscribe((params) => {
      this.companyId = +params.get('id')!; // Get company ID as a number
      console.log('Company ID from route:', this.companyId);
      this.fetchCompanyDetails();
    });
  }

  fetchCompanyDetails() {
    // Fetch company details based on the companyId
    const companies = [
      { id: 1, name: 'Company 1', location: 'New York', status: '1', branches: 5, employees: 120, created: '2023-01-01' },
      { id: 2, name: 'Company 2', location: 'Los Angeles', status: '0', branches: 3, employees: 80, created: '2022-05-10' },
      { id: 3, name: 'Company 3', location: 'Chicago', status: '1', branches: 6, employees: 150, created: '2021-03-23' },
    ];

    this.companyDetails = companies.find((company) => company.id === this.companyId);
  }
}
