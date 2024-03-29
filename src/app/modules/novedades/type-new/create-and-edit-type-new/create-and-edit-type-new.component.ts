import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ClassificationNew, TypeNew } from "app/interfaces";
import { TypeNewService } from "app/services/type-new.service";
/* import { ClassificationNewService } from "app/services/classification-new.service";
import { TemplateNew, TemplatesNew } from "environments/environment"; */
import { ToastrService } from "ngx-toastr";
import { HttpErrorResponse } from "@angular/common/http";
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: "app-create-and-edit-type-new",
  templateUrl: "./create-and-edit-type-new.component.html",
  styleUrls: ["./create-and-edit-type-new.component.css"],
})
export class CreateAndEditTypeNewComponent implements OnInit {
  fg: FormGroup;
  // modal variables
  submitted = false;
  //templates = TemplatesNew;
  id: string = "";
  update = false;

  /* 
   showOne = false;
   showTwo = false;
   showThree = false;
   showFour = false;
   showFive = false;
   showSix = false;
   showSeven = false;
   showEight = false;
   showNotFound = false;
    templateUrl = "template-four";
     template: TemplateNew = {
       name: "",
       id: "",
       url: "",
       operation: "",
     }; */

  selectedFile?: any;
  selectedFileName: string = "";
  preview: string | undefined = "";


  constructor(
    private typeNewsService: TypeNewService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.fg = this.fb.group({});
  }

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    /*     this.setShowCorrespondent();
        this.template = this.templates.filter(
          (currentT) => currentT.url === this.templateUrl
        )[0]; */
    this.fg = this.fb.group(
      {
        description: ["", Validators.required],
        info: ["", Validators.required],
        code: ["", Validators.required],
        is_changing_of_the_guard: [false, Validators.required],
        is_active: [true, Validators.required],
      },
      {}
    );

    if (this.id) {
      this.update = true;
      this.getTypeNew();
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.fg.invalid) {
      this.submitted = false;
      return;
    }
    this.update ? this.updateTypeNew() : this.save();
  }

  onReset() {
    this.submitted = false;
    this.fg.reset();
    this.router.navigate(["type-new"]);
  }

  save() {
    const formData: any = new FormData();
    let values = this.fg.value
    for (const key in values) {
      formData.append(key, values[key]);
    }
    const img = this.selectedFile;
    formData.append('image', img);
    this.typeNewsService.add(this.fg.value).subscribe(
      (data) => {
        this.toastr.success("Tipo de Novedad creado con éxito");
        this.submitted = false;
        this.fg.reset();
        this.router.navigate(["type-new"]);
      },
      (error: HttpErrorResponse) => {
        this.toastr.error(
          error.error.message || "No se pudo crear el Tipo de Novedad"
        );
      }
    );
  }

  selectFiles(event: any): void {
    this.selectedFileName = ""
    this.selectedFile = event.target.files[0];

    this.preview = "";
    if (this.selectedFile) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.preview = e.target.result;
      };

      reader.readAsDataURL(this.selectedFile);

      this.selectedFileName = this.selectedFile.name;
    }
  }

  getTypeNew() {
    this.typeNewsService.get(this.id).subscribe((data: TypeNew) => {
      this.fg.get("description")!.setValue(data.description);
      this.fg.get("info")!.setValue(data.info);
      this.fg.get("code")!.setValue(data.code);
      this.fg.get("is_active")!.setValue(data.is_active);
      this.fg.get("is_changing_of_the_guard")!.setValue(data.is_changing_of_the_guard);
      if (data.image_display)
        this.preview = data.image_display;
      /*       this.fg.get("template")!.setValue(data.template);
            this.fg.get("is_active")!.setValue(data.is_active);
            this.template = this.templates.filter(
              (currentT) => currentT.name === data.template
            )[0];
            this.templateUrl = this.template.url; 
            this.setShowCorrespondent();*/
    });
  }

  updateTypeNew() {
    const formData: any = new FormData();
    let values = this.fg.value
    for (const key in values) {
      formData.append(key, values[key]);
    }
    if (this.selectedFile) {
      const img = this.selectedFile;
      formData.append('image', img);
    }
    this.typeNewsService.update_patch(this.id, formData).subscribe(
      (data) => {
        this.toastr.success("Tipo de Novedad actualizado");
        this.submitted = false;
        this.fg.reset();
        this.router.navigate(["type-new"]);
      },
      (error: HttpErrorResponse) => {
        this.toastr.error(
          error.error.message || "No se pudo actualizar la informacion"
        );
      }
    );
  }
  /* 
    setShowCorrespondent() {
      switch (this.templateUrl) {
        case "template-one":
          this.showOne = true;
          break;
        case "template-two":
          this.showTwo = true;
          break;
        case "template-three":
          this.showThree = true;
          break;
        case "template-four":
          this.showFour = true;
          break;
        case "template-five":
          this.showFive = true;
          break;
        case "template-six":
          this.showSix = true;
          break;
        case "template-seven":
          this.showSeven = true;
          break;
        case "template-eight":
          this.showEight = true;
          break;
        default:
          this.showNotFound = true;
      }
    }
  
    selectionTemplateChange(event: MatSelectChange) {
      this.showOne = false;
      this.showTwo = false;
      this.showThree = false;
      this.showFour = false;
      this.showFive = false;
      this.showSix = false;
      this.showSeven = false;
      this.showEight = false;
      this.showNotFound = false;
      this.template = this.templates.filter(
        (currentT) => currentT.name === event.value
      )[0];
      this.templateUrl = this.template.url;
      this.setShowCorrespondent();
    } */
}
