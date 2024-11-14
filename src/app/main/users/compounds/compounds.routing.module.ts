import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompoundsListComponent } from './compounds-list/compounds-list.component';
import { NewCompoundsComponent } from './new-compounds/new-compounds.component';


// routing
const routes: Routes = [
    {
        path: 'list',
        component: CompoundsListComponent,
        data: { animation: 'CompoundsListComponent' }
    },
    {
        path: 'list/new',
        component: NewCompoundsComponent,
    },
    {
        path: 'list/new/:id',
        component: NewCompoundsComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class CompoundsRoutingModule { }