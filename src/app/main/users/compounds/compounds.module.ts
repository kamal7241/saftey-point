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
import { CompoundsListComponent } from './compounds-list/compounds-list.component';
import { CompoundsListService } from './compounds-list.service';
import { FileUploadModule } from 'ng2-file-upload';
import { CompoundsRoutingModule } from './compounds.routing.module';
import { NewCompoundsComponent } from './new-compounds/new-compounds.component';
import { TranslateModule } from '@ngx-translate/core';
import { PermissionListService } from '../permissions/permission-list.service';

@NgModule({
  declarations: [CompoundsListComponent, NewCompoundsComponent],
  imports: [
    CommonModule,
    CompoundsRoutingModule,
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
  providers: [CompoundsListService, PermissionListService]
})
export class CompoundsModule { }
