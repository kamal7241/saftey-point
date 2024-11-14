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
import { CoorperatesListService } from './coorperates-list.service';
import { FileUploadModule } from 'ng2-file-upload';
import { coorperatesRoutingModule } from './coorperates.routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { PermissionListService } from '../permissions/permission-list.service';
import { NewCoorperatesComponent } from './new-coorperates/new-coorperates.component';
import { CoorperatesListComponent } from './coorperates-list/coorperates-list.component';

@NgModule({
  declarations: [CoorperatesListComponent, NewCoorperatesComponent],
  imports: [
    CommonModule,
    coorperatesRoutingModule,
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
  providers: [CoorperatesListService, PermissionListService]
})
export class CoorperatesModule { }
