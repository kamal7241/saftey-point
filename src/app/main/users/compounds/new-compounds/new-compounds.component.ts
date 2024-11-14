import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { CompoundsListService } from '../compounds-list.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CoreTranslationService } from '@core/services/translation.service';
import { locale as english } from 'app/main/users/compounds/i18n/en';
import { locale as arabic } from 'app/main/users/compounds/i18n/ar';
import { PermissionListService } from '../../permissions/permission-list.service';

@Component({
  selector: 'new-compounds',
  templateUrl: './new-compounds.component.html'
})
export class NewCompoundsComponent implements OnInit {

  public isLoading = true;
  public uploader: FileUploader = new FileUploader({
    url: "URL",
    isHTML5: true
  });
  selectedFiles;
  selectedFile;
  compoundsForm: FormGroup;
  currentItem;
  image;
  roles: any;

  constructor(
    private formBuilder: FormBuilder,
    private _compoundsListService: CompoundsListService,
    private _permissionsService: PermissionListService,
    private router: Router,
    private route: ActivatedRoute,
    private _coreTranslationService: CoreTranslationService
  ) {
    this._coreTranslationService.translate(english, arabic);
  }

  ngOnInit(): void {
    this.compoundsForm = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required]],
      info: [''],
      coverImage: [''],
      isActive: [false],
      commission: [12, [Validators.required]],
      address: ['', [Validators.required]],
      rules: ['']
    });

    const itemId = this.route.snapshot.paramMap.get('id');
    if (itemId) {
      this.currentItem = itemId;
      this.compoundsForm.get('id').setValue(itemId);
      this.getItem(itemId);
    }

    this.getRoles();
  }

  onFileSelected(event: any): void {
    const imageFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = () => {
      return this.selectedFile = fileReader.result;
    };
    fileReader.readAsDataURL(imageFile);
    this._compoundsListService.uploadImage(imageFile).then((response: any) => {
      this.compoundsForm.get("coverImage").setValue(response.innerData.url);
    });
  }

  deleteImage() {
    this.compoundsForm.get("coverImage").setValue(null);
    this.selectedFile = null;
  }

  ConfirmColorOpen(message: string, isSuccess: boolean) {
    Swal.fire({
      title: isSuccess ? 'Success!' : 'Failed!',
      text: message,
      icon: isSuccess ? 'success' : 'error',
      customClass: {
        confirmButton: 'btn btn-success'
      }
    });
  }

  onSubmit() {
    if (this.compoundsForm.valid) {
      this.isLoading = true;
      if (this.currentItem) {
        this.updateItem();
      } else {
        this.saveItem();
      }
    } else {
      console.log('Form is invalid. Please check the fields.');
      this.compoundsForm.markAllAsTouched();
    }
  }

  async getItem(id: string) {
    await this._compoundsListService.getItem(id).then((response: any) => {
      this.compoundsForm.patchValue(response.innerData);
      this.selectedFile = response.innerData.coverImage;
    });
  }

  async saveItem() {
    await this._compoundsListService.addItem(this.compoundsForm.value).then(response => {
      this.isLoading = false;
      if (response.status) {
        this.back();
      } else {
        this.ConfirmColorOpen(response.message, false);
      }
    });
  }

  async updateItem() {
    await this._compoundsListService.updateItem(this.compoundsForm.value).then(response => {
      this.isLoading = false;
      if (response.status) {
        this.back();
      } else {
        this.ConfirmColorOpen(response.message, false);
      }
    });
  }

  async getRoles() {
    await this._permissionsService.getDataTableRows().then(response => {
      this.isLoading = false;
      if (response.status) {
        this.roles = response.innerData;
      } else {
        this.ConfirmColorOpen(response.message, false);
      }
    });
  }

  back() {
    if (this.currentItem) {
      this.router.navigate(['../../'], { relativeTo: this.route });
    } else {
      this.router.navigate(['../'], { relativeTo: this.route });
    }
  }
}
