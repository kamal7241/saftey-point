import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { CoorperatesListService } from '../coorperates-list.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CoreTranslationService } from '@core/services/translation.service';
import { locale as english } from 'app/main/users/coorperates/i18n/en';
import { locale as arabic } from 'app/main/users/coorperates/i18n/ar';
import { PermissionListService } from '../../permissions/permission-list.service';

@Component({
  selector: 'new-coorperates',
  templateUrl: './new-coorperates.component.html'
})
export class NewCoorperatesComponent implements OnInit {
  public isLoading = true;
  public uploader: FileUploader = new FileUploader({
    url: "URL",
    isHTML5: true
  });
  public selectedFiles: any;
  public selectedFile: any;
  public coorperatesForm: FormGroup;
  public currentItem: any;
  public image: any;
  public roles: any;

  /**
   * Constructor
   */
  constructor(
    private formBuilder: FormBuilder,
    private _coorperatesListService: CoorperatesListService,
    private _permissionsService: PermissionListService,
    private router: Router,
    private route: ActivatedRoute,
    private _coreTranslationService: CoreTranslationService
  ) {
    this._coreTranslationService.translate(english, arabic);
  }

  ngOnInit(): void {
    this.initForm();
    this.loadRoles();
    this.checkForExistingItem();
  }

  /**
   * Initialize the form
   */
  private initForm(): void {
    this.coorperatesForm = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required]],
      info: [''],
      coverImage: [''],
      isActive: [false],
      commission: [12, [Validators.required, Validators.min(0)]],
      address: ['', [Validators.required]],
      rules: ['']
    });
  }

  /**
   * Check if there is an existing item to load
   */
  private checkForExistingItem(): void {
    const itemId = this.route.snapshot.paramMap.get('id');
    if (itemId) {
      this.currentItem = itemId;
      this.coorperatesForm.get('id').setValue(itemId);
      this.loadItem(itemId);
    }
  }

  /**
   * Load roles for dropdown
   */
  private async loadRoles(): Promise<void> {
    await this._permissionsService.getDataTableRows().then(response => {
      this.isLoading = false;
      if (response.status) {
        this.roles = response.innerData;
      } else {
        this.showAlert(response.message, false);
      }
    });
  }

  /**
   * Load an existing item
   */
  private async loadItem(id: string): Promise<void> {
    await this._coorperatesListService.getItem(id).then((response: any) => {
      this.coorperatesForm.patchValue(response.innerData);
      this.selectedFile = response.innerData.coverImage;
    });
  }

  /**
   * Handle file selection and upload
   */
  onFileSelected(event: any): void {
    const imageFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.selectedFile = fileReader.result;
    };
    fileReader.readAsDataURL(imageFile);
    this._coorperatesListService.uploadImage(imageFile).then((response: any) => {
      this.coorperatesForm.get("coverImage").setValue(response.innerData.url);
    });
  }

  /**
   * Delete image
   */
  deleteImage(): void {
    this.coorperatesForm.get("coverImage").setValue(null);
    this.selectedFile = null;
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    if (this.coorperatesForm.valid) {
      this.isLoading = true;
      if (this.currentItem) {
        this.updateItem();
      } else {
        this.saveItem();
      }
    } else {
      console.log('Form is invalid. Please check the fields.');
      this.coorperatesForm.markAllAsTouched();
    }
  }

  /**
   * Save new item
   */
  private async saveItem(): Promise<void> {
    await this._coorperatesListService.addItem(this.coorperatesForm.value).then(response => {
      this.isLoading = false;
      if (response.status) {
        this.navigateBack();
      } else {
        this.showAlert(response.message, false);
      }
    });
  }

  /**
   * Update existing item
   */
  private async updateItem(): Promise<void> {
    await this._coorperatesListService.updateItem(this.coorperatesForm.value).then(response => {
      this.isLoading = false;
      if (response.status) {
        this.navigateBack();
      } else {
        this.showAlert(response.message, false);
      }
    });
  }

  /**
   * Show success or failure alert
   */
  private showAlert(message: string, isSuccess: boolean): void {
    Swal.fire({
      title: isSuccess ? 'Success!' : 'Failed!',
      text: message,
      icon: isSuccess ? 'success' : 'error',
      customClass: { confirmButton: 'btn btn-success' }
    });
  }

  /**
   * Navigate back
   */
  private navigateBack(): void {
    const relativePath = this.currentItem ? '../../' : '../';
    this.router.navigate([relativePath], { relativeTo: this.route });
  }
}
