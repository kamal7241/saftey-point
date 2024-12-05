import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageCompaniesComponent } from './manage-companies/manage-companies.component';
import { ManageBranchesComponent } from './manage-branches/manage-branches.component';

const routes: Routes = [
  { path: 'companies', component: ManageCompaniesComponent },
  { path: 'branches', component: ManageBranchesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyManagementRoutingModule {}
