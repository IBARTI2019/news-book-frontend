import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Person, TypePeople } from "../../../../interfaces";
import { PersonService } from "../../../../services/person.service";
import { TypePeopleService } from "../../../../services/type-people.service";

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
  id: string = "";

  constructor(
    private personService: PersonService,
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
    this.typePeopleService.list().subscribe((data: TypePeople[]) => {
      this.listap = data;
    });
    this.fg = this.fb.group(
      {
        code: ["", Validators.required],
        name: ["", Validators.required],
        last_name: ["", Validators.required],
        doc_ident: ["", Validators.required],
        addres: ["", Validators.required],
        phone: ["", Validators.required],
        mobile: ["", Validators.required],
        type_person: ["", Validators.required],
        is_active: [true, Validators.required],
      },
      {}
    );
    if (this.id) {
      this.update = true;
      this.getPerson();
    }
  }

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
    this.router.navigate(["person"]);
  }

  save() {
    this.personService.add(this.fg.value).subscribe(
      (data) => {
        this.toastr.success("Persona creada con éxito!");
        this.submitted = false;
        this.fg.reset();
        this.router.navigate(["person"]);
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
      this.fg.get("code")!.setValue(data.code);
      this.fg.get("name")!.setValue(data.name);
      this.fg.get("last_name")!.setValue(data.last_name);
      this.fg.get("is_active")!.setValue(data.is_active);
      this.fg.get("doc_ident")!.setValue(data.doc_ident);
      this.fg.get("addres")!.setValue(data.addres);
      this.fg.get("phone")!.setValue(data.phone);
      this.fg.get("mobile")!.setValue(data.mobile);
      this.fg.get("type_person")!.setValue(data.type_person);
    });
  }

  updatePerson() {
    this.personService.update(this.id, this.fg.value).subscribe(
      (data) => {
        this.toastr.success("Persona actualizada!");
        this.submitted = false;
        this.fg.reset();
        this.router.navigate(["person"]);
      },
      (error: HttpErrorResponse) => {
        this.submitted = false;
        this.toastr.error(error.error.message || "No se pudo actualizar.");
      }
    );
  }
}
