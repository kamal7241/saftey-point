import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewCoorperatesComponent } from './new-coorperates/new-coorperates.component';
import { CoorperatesListComponent } from './coorperates-list/coorperates-list.component';


// routing
const routes: Routes = [
    {
        path: 'list',
        component: CoorperatesListComponent,
        data: { animation: 'coorperatesListComponent' }
    },
    {
        path: 'list/new',
        component: NewCoorperatesComponent,
    },
    {
        path: 'list/new/:id',
        component: NewCoorperatesComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class coorperatesRoutingModule { }