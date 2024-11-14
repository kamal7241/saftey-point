import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { FlatpickrModule } from 'angularx-flatpickr';

import { CoreCommonModule } from "@core/common.module";
import { CoreDirectivesModule } from "@core/directives/directives";
import { CorePipesModule } from "@core/pipes/pipes.module";
import { CoreSidebarModule } from "@core/components";
import { CustomerListComponent } from "./customer-list/customer-list.component";
import { CustomerListService } from "./customer-list.service";
import { FileUploadModule } from "ng2-file-upload";
import { StudentRoutingModule } from "./customer.routing.module";
import { NewCustomerComponent } from "./new-customer/new-customer.component";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [CustomerListComponent, NewCustomerComponent],
  imports: [
    CommonModule,
    StudentRoutingModule,
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
  ],
  providers: [CustomerListService],
})
export class CustomerModule {}
