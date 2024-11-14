import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


// routing
const routes: Routes = [
    {
        path: 'admins',
        loadChildren: () => import('./admins/admin.module').then(m => m.AdminModule)
    },
    {
        path: 'permissions',
        loadChildren: () => import('./permissions/permission.module').then(m => m.PermissionModule
        )
    }, {
        path: 'customers',
        loadChildren: () => import('./customers/customer.module').then(m => m.CustomerModule
        )
    },
    {
        path: 'visitors',
        loadChildren: () => import('./visitors/visitor.module').then(m => m.VisitorModule
        )
    },
    {
        path: 'organizations',
        loadChildren: () => import('./organizations/organization.module').then(m => m.OrganizationModule)
    },
    {
        path: 'coorperates',
        loadChildren: () => import('./coorperates/coorperates.module').then(m => m.CoorperatesModule)
    },
    {
        path: 'compounds',
        loadChildren: () => import('./compounds/compounds.module').then(m => m.CompoundsModule)
    }


];

@NgModule({
    declarations: [],
    imports: [CommonModule, RouterModule.forChild(routes)]
})
export class UsersModule { }
