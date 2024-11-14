import { NgModule } from '@angular/core';

// Removed FlexLayoutModule import
import { CustomBreakPointsProvider } from 'app/layout/custom-breakpoints';
import { VerticalLayoutModule } from 'app/layout/vertical/vertical-layout.module';
import { HorizontalLayoutModule } from 'app/layout/horizontal/horizontal-layout.module';

@NgModule({
  imports: [
    // Removed FlexLayoutModule.withConfig({ disableDefaultBps: true })
    VerticalLayoutModule,
    HorizontalLayoutModule
  ],
  providers: [CustomBreakPointsProvider],
  exports: [VerticalLayoutModule, HorizontalLayoutModule]
})
export class LayoutModule {}
