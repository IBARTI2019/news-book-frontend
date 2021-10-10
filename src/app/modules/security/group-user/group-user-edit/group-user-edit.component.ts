import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { GroupUser } from "../../../../interfaces";
import { ToastrService } from "ngx-toastr";

import { UserGroupService } from '../../../../services/user-group.service';

@Component({
  selector: 'app-group-user-edit',
  templateUrl: './group-user-edit.component.html',
  styleUrls: ['./group-user-edit.component.css']
})
export class GroupUserEditComponent implements OnInit {
  fg: FormGroup;
  id = "";
  routeState: any;
  redirectTo = "";
  submitted = false;
  update = false;
  constructor(
    private groupService: UserGroupService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute

  ) {
    this.fg = this.fb.group({});
    this.routeState = history.state
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.redirectTo = this.routeState.redirectTo || ""
    this.fg = this.fb.group(
      {
        name: ["", Validators.required]
      }
    );
    if (this.id) {
      this.update = true;
      this.getUser();
    }
  }

  getUser() {
    this.groupService.get(this.id).subscribe(
      (data: GroupUser) => {
        this.fg.get("name")!.setValue(data.name);
      },
      (error: HttpErrorResponse) => {
        this.toastr.error(error.error.message || 'Error al obtener el Grupo');
      }
    );
  }

  onSubmit() {
    if (this.fg.invalid) {
      return;
    }
    this.submitted = true;
    this.update ? this.updateUser() : this.save();
  }

  save() {
    this.groupService.add(this.fg.value).subscribe(
      (data) => {
        this.toastr.success("Datos del Grupo creado con éxito");
        this.submitted = false;
        this.fg.reset();
        this.router.navigate([this.redirectTo || "security/group"]);
      },
      (error: HttpErrorResponse) => {
        this.submitted = false;
        this.toastr.error(error.error.message || "No se pudo crear los datos");
      }
    );
  }

  updateUser() {
    this.groupService.update(this.id, this.fg.value).subscribe(
      (data) => {
        this.toastr.success("Datos del Grupo actualizado");
        this.submitted = false;
        this.fg.reset();
        this.router.navigate(["security/group"]);
      },
      (error: HttpErrorResponse) => {
        this.submitted = false;
        this.toastr.error(
          error.error.message || "No se logro actualizar el Grupo"
        );
      }
    );
  }

  onReset() {
    this.submitted = false;
    this.fg.reset();
    this.router.navigate([this.redirectTo || "security/group"]);
  }
}
