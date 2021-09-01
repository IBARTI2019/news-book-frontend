import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { GroupUser, User } from "../../../../interfaces";
import { ToastrService } from "ngx-toastr";

import { UserService } from '../../../../services/user.service';
import { UserGroupService } from '../../../../services/user-group.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  fg: FormGroup;
  id = "";
  routeState: any;
  redirectTo = "";
  submitted = false;
  update = false;
  listGroups: GroupUser[] = [];
  constructor(
    private userService: UserService,
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
        code: ["", Validators.required],
        password: ["", Validators.required],
        name: ["", Validators.required],
        last_name: ["", Validators.required],
        address: ["", Validators.required],
        email: ["", Validators.required],
        phone: ["", Validators.required],
        groups: [[]],
        is_staff: [false, Validators.required],
        is_active: [true, Validators.required],
      }
    );
    if (this.id) {
      this.update = true;

      this.getUser();
    }
    this.getGroups();
  }

  getUser() {
    this.userService.get(this.id).subscribe(
      (data: User) => {
        this.fg.get("code")!.setValue(data.code);
        this.fg.get("password")!.setValue(data.password);
        this.fg.get("email")!.setValue(data.email);
        this.fg.get("name")!.setValue(data.name);
        this.fg.get("last_name")!.setValue(data.last_name);
        this.fg.get("address")!.setValue(data.address);
        this.fg.get("phone")!.setValue(data.phone);
        this.fg.get("groups")!.setValue(data.groups);
        this.fg.get("is_staff")!.setValue(data.is_staff);
        this.fg.get("is_active")!.setValue(data.is_active);
      },
      (error: HttpErrorResponse) => {
        this.toastr.error(error.error.message || 'Error al obtener el usuario');
      }
    );
  }

  getGroups() {
    this.groupService.list().subscribe((response: GroupUser[]) => {
      this.listGroups = [...response];
    });
  }

  onSubmit() {
    if (this.fg.invalid) {
      return;
    }
    this.submitted = true;
    this.update ? this.updateUser() : this.save();
  }

  save() {
    this.userService.add(this.fg.value).subscribe(
      (data) => {
        this.toastr.success("Datos del Usuario creado con éxito");
        this.submitted = false;
        this.fg.reset();
        this.router.navigate([this.redirectTo || "security/user"]);
      },
      (error: HttpErrorResponse) => {
        this.submitted = false;
        this.toastr.error(error.error.message || "No se pudo crear los datos");
      }
    );
  }

  updateUser() {
    this.userService.update(this.id, this.fg.value).subscribe(
      (data) => {
        this.toastr.success("Datos Usuario actualizado");
        this.submitted = false;
        this.fg.reset();
        this.router.navigate(["security/user"]);
      },
      (error: HttpErrorResponse) => {
        this.submitted = false;
        this.toastr.error(
          error.error.message || "No se logro actualizar el usuario"
        );
      }
    );
  }

  onReset() {
    this.submitted = false;
    this.fg.reset();
    this.router.navigate([this.redirectTo || "security/user"]);
  }
}
