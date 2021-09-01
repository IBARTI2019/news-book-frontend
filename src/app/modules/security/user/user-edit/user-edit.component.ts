import { HttpErrorResponse } from "@angular/common/http";
import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { GroupUser, User } from "../../../../interfaces";
import { ToastrService } from "ngx-toastr";

import { UserService } from '../../../../services/user.service';
import { UserGroupService } from '../../../../services/user-group.service';
import { forkJoin } from 'rxjs';
import { USER_TYPES } from 'app/constants';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit, AfterViewChecked {
  fg: FormGroup;
  id = "";
  routeState: any;
  redirectTo = "";
  submitted = false;
  update = false;
  listGroups: GroupUser[] = [];
  isOesvicaUser = false
  listUsers: User[] = []
  listTypes = [...USER_TYPES]
  multipleLocalBooks = true
  disableOtherBooks = false
  bookSelected = ''
  localBooks = [
    {
      name: 'Libro 1',
    },
    {
      name: 'Libro 2',
    },
    {
      name: 'Libro 3',
    },
    {
      name: 'Libro 4',
    },
    {
      name: 'Libro 5',
    }
  ]
  constructor(
    private userService: UserService,
    private groupService: UserGroupService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private chDRef: ChangeDetectorRef
  ) {
    this.fg = this.fb.group({});
    this.routeState = history.state
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id || "";
    this.redirectTo = this.routeState.redirectTo || ""
    this.isOesvicaUser = this.userService.user$.getValue().oesvica_user
    this.fg = this.fb.group(
      {
        ficha: ["", this.isOesvicaUser ? Validators.required : Validators.nullValidator],
        ci: ["", this.isOesvicaUser ? [Validators.required, Validators.pattern('^[0-9]+$')] : Validators.nullValidator],
        code: ["", Validators.required],
        password: ["", Validators.required],
        name: ["", Validators.required],
        last_name: ["", Validators.required],
        address: ["", Validators.required],
        email: ["", Validators.required],
        phone: ["", Validators.required],
        type: [0, Validators.required],
        groups: [[]],
        books: [[]],
        security_user: ["", Validators.required],
        is_staff: [false],
        is_active: [true, Validators.required],
      }
    );
    if (this.id) {
      this.update = true;
      this.getUser();
    }
    this.getGroupsAndUsers();
  }

  ngAfterViewChecked(): void {    
    // if (this.fg.value.type !== 3) {
    //   this.multipleLocalBooks = true
    //   if (typeof this.fg.get("books")!.value === 'string') this.fg.get("books")!.setValue([])
    // } else {
    //   this.multipleLocalBooks = false
    //   if (typeof this.fg.get("books")!.value !== 'string')
    //   this.fg.get("books")!.setValue('')
    // }
    // this.chDRef.detectChanges()
  }

  getUser() {
    this.userService.get(this.id).subscribe(
      (data: User) => {
        const security: any = data.security_user
        this.fg.get("ficha")!.setValue(data.ficha || 'field no exist')
        this.fg.get("ci")!.setValue(data.ci || '0000000')
        this.fg.get("code")!.setValue(data.code);
        this.fg.get("password")!.setValue(data.password);
        this.fg.get("email")!.setValue(data.email);
        this.fg.get("name")!.setValue(data.name);
        this.fg.get("last_name")!.setValue(data.last_name);
        this.fg.get("security_user")!.setValue(security.id || null)
        this.fg.get("type")!.setValue(data.type || 0)
        this.fg.get("books")!.setValue(data.books || [])
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

  getGroupsAndUsers() {
    forkJoin([this.groupService.list(), this.userService.list()]).subscribe((response: [GroupUser[], User[]]) => {
      this.listGroups = [...response[0]];
      this.listUsers = [...response[1].filter((user: User) => user.id !== this.id)];
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
    this.userService.add({...this.fg.value, oesvica_user: this.isOesvicaUser}).subscribe(
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

  handleType() {
    this.fg.get("books")!.setValue([])
    this.disableOtherBooks = false
  }

  handleBooks() {
    if (this.fg.get("type")!.value === 3) {
      if (this.fg.get("books")!.value.length === 1) {
        this.bookSelected = this.fg.get("books")!.value[0]
        this.disableOtherBooks = true
      } else {
        this.disableOtherBooks = false
      }
    } else {
      this.disableOtherBooks = false
    }
    // if (this.fg.get("books")!.value.length < 1) {
    // }
  }

  onReset() {
    this.submitted = false;
    this.fg.reset();
    this.router.navigate([this.redirectTo || "security/user"]);
  }
}
