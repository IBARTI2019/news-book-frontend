import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { TypePeople } from "app/interfaces";
import { ToastrService } from "ngx-toastr";
import { TypePeopleService } from "../../../../services/type-people.service";

@Component({
  selector: "app-create-and-edit-type-people",
  templateUrl: "./create-and-edit-type-people.component.html",
  styleUrls: ["./create-and-edit-type-people.component.css"],
})
export class CreateAndEditTypePeopleComponent implements OnInit {
  fg: FormGroup;
  submitted = false;
  id: string = "";
  update: boolean = false;
  constructor(
    private typePeopleService: TypePeopleService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.fg = this.fb.group({});
  }

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this.fg = this.fb.group(
      {
        description: ["", Validators.required],
        priority: ["", Validators.required],
        status: [true, Validators.required],
      },
      {}
    );
    if (this.id) {
      this.update = true;
      this.getTypePeople();
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.fg.invalid) {
      this.submitted = false;
      return;
    }
    this.update ? this.updateTypePeople() : this.save();
  }

  onReset() {
    this.submitted = false;
    this.fg.reset();
    this.router.navigate(["inicio/type-people"]);
  }

  save() {
    this.typePeopleService.add(this.fg.value).subscribe(
      (data) => {
        this.toastr.success("Tipo de Persona creado con éxito.");
        this.submitted = false;
        this.fg.reset();
        this.router.navigate(["inicio/type-people"]);
      },
      (error: HttpErrorResponse) => {
        this.toastr.error(
          error.error.message || "No se pudo crear el Tipo de Persona."
        );
      }
    );
  }

  getTypePeople() {
    this.typePeopleService.get(this.id).subscribe(
      (data: TypePeople) => {
        this.fg.get("description")!.setValue(data.description);
        this.fg.get("priority")!.setValue(data.priority);
        this.fg.get("status")!.setValue(data.status);
      },
      (error: HttpErrorResponse) => {
        this.toastr.error(
          error.error.message || "No se pudo obtener el Tipo de Persona"
        );
      }
    );
  }

  updateTypePeople() {
    this.typePeopleService.update(this.id, this.fg.value).subscribe(
      (data) => {
        this.toastr.success("El Tipo de Persona se actualizo correctamente.");
        this.submitted = false;
        this.fg.reset();
        this.router.navigate(["inicio/type-persons/maestro"]);
      },
      (error: HttpErrorResponse) => {
        this.toastr.error(
          error.error.message || "No se pudo actualizar el Tipo de Persona"
        );
      }
    );
  }
}
