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
import { AdminListComponent } from './admin-list/admin-list.component';
import { AdminListService } from './admin-list.service';
import { FileUploadModule } from 'ng2-file-upload';
import { AdminRoutingModule } from './admin.routing.module';
import { NewAdminComponent } from './new-admin/new-admin.component';
import { TranslateModule } from '@ngx-translate/core';
import { PermissionListService } from '../permissions/permission-list.service';

@NgModule({
  declarations: [AdminListComponent, NewAdminComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
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
    TranslateModule
  ],
  providers: [AdminListService, PermissionListService]
})
export class AdminModule { }
