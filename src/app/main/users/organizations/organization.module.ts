import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FlatpickrModule } from 'angularx-flatpickr';

import { CoreCommonModule } from '@core/common.module';
import { CoreDirectivesModule } from '@core/directives/directives';
import { CorePipesModule } from '@core/pipes/pipes.module';
import { CoreSidebarModule } from '@core/components';
import { OrganizationListComponent } from './organization-list/organization-list.component';
import { OrganizationListService } from './organization-list.service';
import { FileUploadModule } from 'ng2-file-upload';
import { OrganizationRoutingModule } from './organization.routing.module';
import { NewOrganizationComponent } from './new-organization/new-organization.component';
import { TranslateModule } from '@ngx-translate/core';
import { OrganizationPreviewComponent } from './organization-view/organization-preview.component';
import { OrganizationOverviewComponent } from './organization-view/organization-overview/organization-overview.component';
import { PayoutRequestsModule } from 'app/main/apps/payout-requests/new-payout-requests.module';

@NgModule({
  declarations: [OrganizationListComponent, NewOrganizationComponent, OrganizationPreviewComponent, OrganizationOverviewComponent],
  imports: [
    CommonModule,
    OrganizationRoutingModule,
    CoreCommonModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    FlatpickrModule,
    NgxDatatableModule,
    CorePipesModule,
    CoreDirectivesModule,
    CoreSidebarModule,
    FileUploadModule,
    TranslateModule,
    PayoutRequestsModule
  ],
  providers: [OrganizationListService]
})
export class OrganizationModule { }
