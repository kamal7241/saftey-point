import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CompanyManagementRoutingModule } from './company-management-routing.module';
import { ManageCompaniesComponent } from './manage-companies/manage-companies.component';
import { ManageBranchesComponent } from './manage-branches/manage-branches.component';
import { CompanyDetailsComponent } from './company-details/company-details.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    CompanyManagementRoutingModule,
    ManageCompaniesComponent,
    ManageBranchesComponent,
    CompanyDetailsComponent,
  ],
  providers: [],
})
export class CompanyManagementModule {}
