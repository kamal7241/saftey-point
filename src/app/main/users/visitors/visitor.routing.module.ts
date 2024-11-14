import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { VisitorListComponent } from "./visitor-list/visitor-list.component";
import { NewVisitorComponent } from "./new-visitor/new-visitor.component";

// routing
const routes: Routes = [
  {
    path: "list",
    component: VisitorListComponent,
    data: { animation: "VisitorListComponent" },
  },
  {
    path: "list/new",
    component: NewVisitorComponent,
  },
  {
    path: "list/new/:id",
    component: NewVisitorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentRoutingModule {}
