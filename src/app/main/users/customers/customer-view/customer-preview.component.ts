import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { CustomerListService } from "../customer-list.service";
import { Observable } from "rxjs";

@Component({
  selector: "app-customer-preview",
  templateUrl: "./customer-preview.component.html",
  styleUrls: ["./customer-preview.service.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class CustomerPreviewComponent implements OnInit, OnDestroy {
  // public
  public apiData;
  public urlLastValue;
  public url: string;
  public sidebarToggleRef = false;
  public paymentSidebarToggle = false;
  public paymentDetails = {
    totalDue: "$12,110.55",
    bankName: "American Bank",
    country: "United States",
    iban: "ETD95476213874685",
    swiftCode: "BR91905",
  };

  // private
  private _unsubscribeAll: Observable<any>;

  /**
   * Constructor
   *
   * @param {Router} router
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private router: Router,
    private _customerPreviewService: CustomerListService
  ) {
    this._unsubscribeAll = new Observable();
    this.urlLastValue = this.url.substr(this.url.lastIndexOf("/") + 1);
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    // this._customerPreviewService.onInvoicPreviewChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
    //   this.apiData = response;
    // });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    // this._unsubscribeAll.next(null);
    // this._unsubscribeAll.complete();
  }
}
