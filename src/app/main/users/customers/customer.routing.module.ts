import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CustomerListComponent } from "./customer-list/customer-list.component";
import { NewCustomerComponent } from "./new-customer/new-customer.component";

// routing
const routes: Routes = [
  {
    path: "list",
    component: CustomerListComponent,
    data: { animation: "CustomerListComponent" },
  },
  {
    path: "list/new",
    component: NewCustomerComponent,
  },
  {
    path: "list/new/:id",
    component: NewCustomerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentRoutingModule {}
