import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ClassificationNew, TypeNew } from "app/interfaces";
import { TypeNewService } from "app/services/type-new.service";
import { ClassificationNewService } from "app/services/classification-new.service";
import { TemplatesNew } from "environments/environment";
import { ToastrService } from "ngx-toastr";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-create-and-edit-type-new",
  templateUrl: "./create-and-edit-type-new.component.html",
  styleUrls: ["./create-and-edit-type-new.component.css"],
})
export class CreateAndEditTypeNewComponent implements OnInit {
  fg: FormGroup;
  // modal variables
  submitted = false;
  clasifnews: ClassificationNew[] = [];
  templates = TemplatesNew;
  id: string = "";
  update = false;

  constructor(
    private typeNewsService: TypeNewService,
    private serviceclasificacion: ClassificationNewService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.fg = this.fb.group({});
  }

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this.serviceclasificacion.list().subscribe((data: ClassificationNew[]) => {
      this.clasifnews = data;
    });

    this.fg = this.fb.group(
      {
        descripton: ["", Validators.required],
        info: ["", Validators.required],
        id_classify: ["", Validators.required],
        plantilla: ["", Validators.required],
        status: [true, Validators.required],
      },
      {}
    );

    if (this.id) {
      this.update = true;
      this.getTypeNew()
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.fg.invalid) {
      this.submitted = false;
      return;
    }
    this.update ? this.updateTypeNew : this.save()
  }

  onReset() {
    this.submitted = false;
    this.fg.reset();
    this.router.navigate(["inicio/type-new"]);
  }

  save() {
    this.typeNewsService.add(this.fg.value).subscribe(
      (data) => {
        this.toastr.success("Tipo de Novedad creado con éxito");
        this.submitted = false;
        this.fg.reset();
        this.router.navigate(["inicio/type-new"]);
      },
      (error: HttpErrorResponse) => {
        this.toastr.error(
          error.error.message || "No se pudo crear el Tipo de Novedad"
        );
      }
    );
  }

  getTypeNew() {
    this.typeNewsService.get(this.id).subscribe((data: TypeNew) => {
      this.fg.get("descripton")!.setValue(data.descripton);
      this.fg.get("info")!.setValue(data.info);
      this.fg.get("id_classify")!.setValue(data.id_classify);
      this.fg.get("plantilla")!.setValue(data.plantilla);
      this.fg.get("status")!.setValue(data.status);
    });
  }

  updateTypeNew() {
    this.typeNewsService.update(this.id, this.fg.value).subscribe(
      (data) => {
        this.toastr.success("Tipo de Novedad actualizado");
        this.submitted = false;
        this.fg.reset();
        this.router.navigate(["inicio/type-new"]);
      },
      (error: HttpErrorResponse) => {
        this.toastr.error(
          error.error.message || "No se pudo actualizar la informacion"
        );
      }
    );
  }
}
