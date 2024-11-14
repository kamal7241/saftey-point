import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CompoundsListService } from '../compounds-list.service';
import { Compounds } from 'rxjs';


@Component({
  selector: 'app-compounds-preview',
  templateUrl: './compounds-preview.component.html',
  styleUrls: ['./compounds-preview.service.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CompoundsPreviewComponent implements OnInit, OnDestroy {
  // public
  public apiData;
  public urlLastValue;
  public url: string;
  public sidebarToggleRef = false;
  public paymentSidebarToggle = false;
  public paymentDetails = {
    totalDue: '$12,110.55',
    bankName: 'American Bank',
    country: 'United States',
    iban: 'ETD95476213874685',
    swiftCode: 'BR91905'
  };

  // private
  private _unsubscribeAll: Compounds<any>;

  /**
   * Constructor
   *
   * @param {Router} router
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private router: Router,
    private _compoundsPreviewService: CompoundsListService,
  ) {
    this._unsubscribeAll = new Compounds();
    this.urlLastValue = this.url.substr(this.url.lastIndexOf('/') + 1);
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------


  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    // this._compoundsPreviewService.onInvoicPreviewChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
    //   this.apiData = response;
    // });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
