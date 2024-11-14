import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ScrollingModule } from '@angular/cdk/scrolling';

import { CoreMenuModule } from '@core/components';
import { CoreCommonModule } from '@core/common.module';

import { VerticalMenuComponent } from 'app/layout/components/menu/vertical-menu/vertical-menu.component';

@NgModule({
  declarations: [VerticalMenuComponent],
  imports: [
    CoreMenuModule,
    CoreCommonModule,
    ScrollingModule,  // Use Angular CDK Scrolling instead
    RouterModule
  ],
  exports: [VerticalMenuComponent]
})
export class VerticalMenuModule {}
