import { HttpErrorResponse } from "@angular/common/http";
import { Component, Inject, Input, OnInit, } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { Material } from "app/interfaces";
import { MaterialsService } from "app/services/materials.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-create-and-edit-material",
  templateUrl: "./create-and-edit-material.component.html",
  styleUrls: ["./create-and-edit-material.component.css"],
})
export class CreateAndEditMaterialComponent implements OnInit {
  fg: FormGroup;
  submitted = false;
  update = false;
  id = "";
  routeState: any;
  redirectTo = "";
  @Input() modal = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      modal: boolean,
      id: string,
    },
    private mdDialogRef: MatDialogRef<CreateAndEditMaterialComponent>,
    private materialService: MaterialsService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.fg = this.fb.group({});
    this.routeState = history.state
  }

  ngOnInit() {
    this.id = this.route.snapshot.params.id ? this.route.snapshot.params.id : this.data.id;
    this.redirectTo = this.routeState.redirectTo || ""

    this.fg = this.fb.group(
      {
        code: ["",],
        serial: [""],
        description: ["", Validators.required],
        is_active: [true, Validators.required],
      },
      {}
    );
    if (this.id) {
      this.update = true;
      this.getMaterial();
    }
  }

  onSubmit() {
    if (this.fg.invalid) {
      return;
    }
    this.submitted = true;
    this.update ? this.updateMaterial() : this.save();
  }

  onReset() {
    this.submitted = false;
    this.fg.reset();
    this.router.navigate([this.redirectTo || "materials"]);
  }

  save() {
    this.materialService.add(this.fg.value).subscribe(
      (data) => {
        this.toastr.success("Datos del Material creado con éxito");
        this.submitted = false;
          this.fg.reset();
          this.mdDialogRef.close(data);
          
      },
      (error: HttpErrorResponse) => {
        this.submitted = false;
        this.toastr.error(error.error.message || "No se pudo crear los datos");
      }
    );
  }

  getMaterial() {
    this.materialService.get(this.id).subscribe(
      (data: Material) => {
        this.fg.get("code")!.setValue(data.code);
        this.fg.get("serial")!.setValue(data.serial);
        this.fg.get("description")!.setValue(data.description);
        this.fg.get("is_active")!.setValue(data.is_active);
      },
      (error: HttpErrorResponse) => {
        this.toastr.error( error.error.message || 'Error al obtener el material');
      }
    );
  }

  updateMaterial() {
    this.materialService.update(this.id, this.fg.value).subscribe(
      (data) => {
        this.toastr.success("Datos Material  actualizado");
        this.submitted = false;
        // this.fg.reset();
        // this.router.navigate(["materials"]);
      },
      (error: HttpErrorResponse) => {
        this.submitted = false;
        this.toastr.error(
          error.error.message || "No se logro actualizar el material"
        );
      }
    );
  }
}
