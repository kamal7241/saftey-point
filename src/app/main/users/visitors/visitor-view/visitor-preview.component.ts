import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { VisitorListService } from "../visitor-list.service";
import { Observable } from "rxjs";

@Component({
  selector: "app-visitor-preview",
  templateUrl: "./visitor-preview.component.html",
  styleUrls: ["./visitor-preview.service.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class VisitorPreviewComponent implements OnInit, OnDestroy {
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
    private _visitorPreviewService: VisitorListService
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
    // this._visitorPreviewService.onInvoicPreviewChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
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
