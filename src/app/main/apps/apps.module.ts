import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


// routing
const routes: Routes = [
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule)
  },
  {
    path: 'payout-requests',
    loadChildren: () => import('./payout-requests/new-payout-requests.module').then(m => m.PayoutRequestsModule)
  },
  {
    path: 'transaction-history',
    loadChildren: () => import('./transactionList/transactionList.module').then(m => m.TransactionListModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./notifications/notification.module').then(m => m.NotificationModule)
  },
  {
    path: 'support',
    loadChildren: () => import('./support/support.module').then(m => m.SupportModule)
  },
  {
    path: 'termsAndConditions',
    loadChildren: () => import('./termsAndConditions/termsAndConditions.module').then(m => m.TermsAndConditionsModule)
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class AppsModule { }
