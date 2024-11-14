import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FileUploader } from "ng2-file-upload";
import { VisitorListService } from "../visitor-list.service";
import { ActivatedRoute, Router } from "@angular/router";
import Swal from "sweetalert2";
import { CoreTranslationService } from "@core/services/translation.service";
import { locale as english } from "app/main/users/customers/i18n/en";
import { locale as arabic } from "app/main/users/customers/i18n/ar";

@Component({
  selector: "new-visitor",
  templateUrl: "./new-visitor.component.html",
})
export class NewVisitorComponent implements OnInit {
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

  constructor(
    private formBuilder: FormBuilder,
    private _visitorListService: VisitorListService,
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
      visitDate: ["", [Validators.required]],
      phone: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      invitationStatus: ["", [Validators.required]],
      invitationCode: ["", [Validators.required]],
      image: ["", [Validators.required]]
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
    this._visitorListService.uploadImage(imageFile).then((response: any) => {
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
      const visitor = {
        firstName: this.currentForm.value.firstName,
        lastName: this.currentForm.value.lastName,
        visitDate: this.currentForm.value.visitDate,
        phone: this.currentForm.value.phone,
        email: this.currentForm.value.email,
        image: this.currentForm.value.image,
        invitationStatus: this.currentForm.value.invitationStatus,
        invitationCode: this.currentForm.value.invitationCode,
      };
      if (this.currentItem) {
        this.updateItem(visitor);
      } else {
        this.saveItem(visitor);
      }
    } else {
      console.log("Form is invalid. Please check the fields.");
      this.currentForm.markAllAsTouched();
    }
  }

  async getItem(id: string) {
    await this._visitorListService.getItem(id).then((response: any) => {
      const visitor = response.innerData.visitor;
      this.currentForm.patchValue({
        id: response.innerData.visitorId,
        firstName: visitor.firstName,
        lastName: visitor.lastName,
        visitDate: visitor.visitDate,
        phone: visitor.phone,
        email: visitor.email,
        invitationStatus: visitor.invitationStatus,
        invitationCode: visitor.invitationCode,
        image: visitor.image
      });
      this.selectedFile = visitor.image;
    });
  }

  async saveItem(visitor: any) {
    console.log(visitor);
    await this._visitorListService.addItem(visitor).then((response) => {
      this.isLoading = false;
      if (response.status) {
        this.back();
      } else {
        this.ConfirmColorOpen(response.message, false);
      }
    });
  }

  async updateItem(visitor: any) {
    console.log(visitor);
    await this._visitorListService.updateItem(visitor).then((response) => {
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
