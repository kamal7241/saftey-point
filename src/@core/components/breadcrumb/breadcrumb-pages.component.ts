import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RouterLink } from '@angular/router'; // Import RouterLink

@Component({
  selector: 'app-breadcrumb-pages',
  standalone: true,
  imports: [CommonModule, RouterLink], // Add RouterLink to imports
  template: `
    <div class="flex flex-row items-center justify-start gap-2.5">
      <ng-container *ngFor="let crumb of translatedBreadcrumbs; let last = last">
        <div class="flex flex-row items-center justify-center gap-2.5">
          <span
            class="font-['Jost'] text-sm"
            [ngClass]="{'text-[#8E8E8E]': !last, 'text-light-200': last}"
          >
            <ng-container *ngIf="!last; else lastCrumb">
              <a [routerLink]="crumb.path" class="hover:underline">{{crumb.label}}</a>
              <span> / </span>
            </ng-container>
            <ng-template #lastCrumb>
              {{ crumb.label }}
            </ng-template>
          </span>
        </div>
      </ng-container>
    </div>
  `,
})
export class BreadcrumbComponentPages implements OnInit {
  @Input() breadcrumbs: { label: string; path?: string }[] = [];
  translatedBreadcrumbs: { label: string; path?: string }[] = [];

  constructor(private translateService: TranslateService) { }

  ngOnInit() {
    this.translateBreadcrumbs();
    this.translateService.onLangChange.subscribe(() => {
      this.translateBreadcrumbs();
    });
  }

  translateBreadcrumbs() {
    this.translatedBreadcrumbs = this.breadcrumbs.map(crumb => ({
      label: this.translateService.instant(crumb.label), // Use instant for translation
      path: crumb.path
    }));
  }
}
