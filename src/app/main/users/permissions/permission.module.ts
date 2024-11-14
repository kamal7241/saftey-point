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
import { PermissionListComponent } from './permission-list/permission-list.component';
import { PermissionListService } from './permission-list.service';
import { FileUploadModule } from 'ng2-file-upload';
import { PermissionRoutingModule } from './permission.routing.module';
import { NewPermissionComponent } from './new-permission/new-permission.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [PermissionListComponent, NewPermissionComponent],
  imports: [
    CommonModule,
    PermissionRoutingModule,
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
  providers: [PermissionListService]
})
export class PermissionModule { }
