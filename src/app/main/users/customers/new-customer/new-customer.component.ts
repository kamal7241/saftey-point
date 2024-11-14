import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FileUploader } from "ng2-file-upload";
import { CustomerListService } from "../customer-list.service";
import { ActivatedRoute, Router } from "@angular/router";
import Swal from "sweetalert2";
import { CoreTranslationService } from "@core/services/translation.service";
import { locale as english } from "app/main/users/customers/i18n/en";
import { locale as arabic } from "app/main/users/customers/i18n/ar";

@Component({
  selector: "new-customer",
  templateUrl: "./new-customer.component.html",
})
export class NewCustomerComponent implements OnInit {
  public isLoading = false;

  public uploader: FileUploader = new FileUploader({
    url: "URL",
    isHTML5: true,
  });
  selectedFiles;
  selectedFile;
  currentForm: FormGroup;
  currentItem;
  image;

  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private formBuilder: FormBuilder,
    private _customerListService: CustomerListService,
    private router: Router,
    private route: ActivatedRoute,
    private _coreTranslationService: CoreTranslationService
  ) {
    this._coreTranslationService.translate(english, arabic);
  }

  ngOnInit(): void {
    this.currentForm = this.formBuilder.group({
      id: [""],
      firstName: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", [Validators.required]],
      password: [""],
      accountStatus: ["", [Validators.required]],
      image: ["", [Validators.required]],
      isResidential: ["", [Validators.required]],
      isEmployee: ["", [Validators.required]]
    });

    const itemId = this.route.snapshot.paramMap.get("id");
    if (itemId) {
      this.currentItem = itemId;
      this.currentForm.get("id").setValue(itemId);
      this.getItem(itemId);
    }
  }

  onStatusChange(): void {}

  onFileSelected(event: any): void {
    const imageFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.selectedFile = fileReader.result;
    };
    fileReader.readAsDataURL(imageFile);
    this._customerListService.uploadImage(imageFile).then((response: any) => {
      console.log(response);
      this.currentForm.get("image").setValue(response.innerData.url);
    });
  }

  deleteImage() {
    this.currentForm.get("image").setValue(null);
    this.selectedFile = null;
  }

  ConfirmColorOpen(message: string, isSuccess: boolean) {
    Swal.fire({
      title: isSuccess ? "Success!" : "Failed!",
      text: message,
      icon: isSuccess ? "success" : "error",
      customClass: {
        confirmButton: "btn btn-success",
      },
    });
  }

  onSubmit() {
    console.log(this.currentForm.value);
    if (this.currentForm.valid) {
      this.isLoading = true;
      const user = {
        id: this.currentForm.value.id,
        firstName: this.currentForm.value.firstName,
        lastName: this.currentForm.value.lastName,
        phone: this.currentForm.value.phone,
        email: this.currentForm.value.email,
        password: this.currentForm.value.password,
        image: this.currentForm.value.image,
        accountStatus: this.currentForm.value.accountStatus,
        isResidential: this.currentForm.value.isResidential,
        isEmployee: this.currentForm.value.isEmployee
      };
      if (this.currentItem) {
        this.updateItem(user);
      } else {
        this.saveItem(user);
      }
    } else {
      console.log("Form is invalid. Please check the fields.");
      this.currentForm.markAllAsTouched();
    }
  }

  async getItem(id: string) {
    await this._customerListService.getItem(id).then((response: any) => {
      const customer = response.innerData;
      this.currentForm.patchValue({
        id: response.innerData.id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        accountStatus: customer.accountStatus,
        image: customer.image,
        isResidential: customer.isResidential,
        isEmployee: customer.isEmployee
      });
      this.selectedFile = response.innerData.image;
    });
  }

  async saveItem(user: any) {
    console.log(user);
    await this._customerListService.addItem(user).then((response) => {
      this.isLoading = false;
      if (response.status) {
        this.back();
      } else {
        this.ConfirmColorOpen(response.message, false);
      }
    });
  }

  async updateItem(user: any) {
    console.log(user);
    await this._customerListService.updateItem(user).then((response) => {
      this.isLoading = false;
      if (response.status) {
        this.back();
      } else {
        this.ConfirmColorOpen(response.message, false);
      }
    });
  }

  back() {
    if (this.currentItem) {
      this.router.navigate(["../../"], { relativeTo: this.route });
    } else {
      this.router.navigate(["../"], { relativeTo: this.route });
    }
  }
}
