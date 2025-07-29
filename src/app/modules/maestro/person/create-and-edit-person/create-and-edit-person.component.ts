import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit, Inject, ViewChild, NgZone } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Person, TypePeople } from "../../../../interfaces";
import { PersonService } from "../../../../services/person.service";
import { TypePeopleService } from "../../../../services/type-people.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CdkTextareaAutosize } from "@angular/cdk/text-field";
import { take } from "rxjs/operators";
export interface DialogData {
  id: string;
  doc_ident?: string;
  redirect: boolean;
}
@Component({
  selector: "app-create-and-edit-person",
  templateUrl: "./create-and-edit-person.component.html",
  styleUrls: ["./create-and-edit-person.component.css"],
})
export class CreateAndEditPersonComponent implements OnInit {
  fg: FormGroup;
  submitted = false;
  listap: TypePeople[] = [];
  update: boolean = false;
  routeState: any;
  redirectTo = "";
  id: string = "";
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;
  updated = false;
  isDocIdentReadonly = false;
  
  constructor(
    private personService: PersonService,
    private typePeopleService: TypePeopleService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<CreateAndEditPersonComponent>,
    private _ngZone: NgZone,
    @Inject(MAT_DIALOG_DATA) public data?: DialogData,
  ) {
    this.fg = this.fb.group({});
    this.routeState = history.state
  }

  ngOnInit() {
    this.updated = false;
    this.id = this.data?.id || ''; //this.route.snapshot.params.id;
    this.redirectTo = this.routeState.redirectTo || ""
    this.typePeopleService.list({ not_paginator: true }).subscribe((data: TypePeople[]) => {
      this.listap = data;
    });
    this.fg = this.fb.group(
      {
        name: ["", Validators.required],
        last_name: ["", Validators.required],
        doc_ident: ["", Validators.required],
        phone: [""],
        mobile: [""],
        type_person: ["", Validators.required],
        company: [""],
        rif: [""],
        is_active: [true],
        blacklist: [false],
        blacklist_reason: [""],
        default_visit_location: [""],
        default_visit_reason: [""],
      },
      {}
    );
    if (this.id) {
      // Flujo normal de actualización
      this.update = true;
      this.getPerson();
    } else if (this.data?.doc_ident) {
      this.isDocIdentReadonly = true; // Se activa el flag para la plantilla
      
      // Se asigna la cédula al formulario
      this.fg.patchValue({
        doc_ident: this.data.doc_ident
      });
    }
  }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  }

  requiredCompanyData = (typeId: string) => this.listap.find(t => t.id == typeId)?.requires_company_data;

  onSubmit() {
    this.submitted = true;
    if (this.fg.invalid) {
      this.submitted = false;
      return;
    }
    this.update ? this.updatePerson() : this.save();
  }

  onReset() {
    this.submitted = false;
    this.fg.reset();
    if (this.data?.redirect == true)
      this.router.navigate([this.redirectTo || "person"]);
  }

  save() {
    this.personService.add(this.fg.value).subscribe(
      (data) => {
        this.toastr.success("Persona creada con éxito!");
        this.submitted = false;
        this.dialogRef.close(data);
        this.fg.reset();
        if (this.data?.redirect == true)
          this.router.navigate([this.redirectTo || "person"]);
      },
      (error: HttpErrorResponse) => {
        this.submitted = false;
        this.toastr.error(
          error.error.message || "Ocurrio un error al crear a la persona."
        );
      }
    );
  }

  getPerson() {
    this.personService.get(this.id || '').subscribe((data: Person) => {
      //this.fg.get("code")!.setValue(data.code);
      this.fg.get("name")!.setValue(data.name);
      this.fg.get("last_name")!.setValue(data.last_name);
      this.fg.get("is_active")!.setValue(data.is_active);
      this.fg.get("doc_ident")!.setValue(data.doc_ident);
      //this.fg.get("address")!.setValue(data.address);
      this.fg.get("phone")!.setValue(data.phone);
      this.fg.get("mobile")!.setValue(data.mobile);
      this.fg.get("type_person")!.setValue(data.type_person);
      this.fg.get("company")!.setValue(data.company);
      this.fg.get("rif")!.setValue(data.rif);

      this.fg.get("blacklist")!.setValue(data.blacklist);
      this.fg.get("blacklist_reason")!.setValue(data.blacklist_reason);

      this.fg.get("default_visit_location")!.setValue(data.default_visit_location);
      this.fg.get("default_visit_reason")!.setValue(data.default_visit_reason);
    });
  }

  updatePerson() {
    this.personService.update(this.id, this.fg.value).subscribe(
      (data) => {
        this.toastr.success("Persona actualizada!");
        this.updated = true;
        this.submitted = false;
        this.getPerson();
      },
      (error: HttpErrorResponse) => {
        this.submitted = false;
        this.toastr.error(error.error.message || "No se pudo actualizar.");
      }
    );
  }
}
