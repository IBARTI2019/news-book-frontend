import { HttpErrorResponse } from "@angular/common/http";
import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Book, GroupUser, User } from "../../../../interfaces";
import { ToastrService } from "ngx-toastr";

import { UserService } from '../../../../services/user.service';
import { UserGroupService } from '../../../../services/user-group.service';
import { forkJoin } from 'rxjs';
import { USER_TYPES } from 'app/constants';
import { BooksService } from "app/services/books.service";

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
  localBooks: Book[] = []
  constructor(
    private userService: UserService,
    private groupService: UserGroupService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private chDRef: ChangeDetectorRef,
    private booksService: BooksService
  ) {
    this.fg = this.fb.group({});
    this.routeState = history.state
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id || "";
    this.redirectTo = this.routeState.redirectTo || ""
    this.isOesvicaUser = this.userService.user$.getValue().oesvica_user
    this.booksService.list().subscribe((books: Book[]) => {
      this.localBooks = books;
    });
    this.fg = this.fb.group(
      {
        ficha: [null, this.isOesvicaUser ? Validators.required : Validators.nullValidator],
        identification_number: ["", this.isOesvicaUser ? [Validators.required, Validators.pattern('^[0-9]+$')] : Validators.nullValidator],
        code: ["", Validators.required],
        password: ["", this.id ? Validators.nullValidator : Validators.required],
        password2: [""],
        name: ["", Validators.required],
        last_name: ["", Validators.required],
        address: ["", Validators.required],
        email: ["", Validators.required],
        phone: ["", Validators.required],
        type_user: [0, Validators.required],
        groups: [[]],
        locations: [[]], // <- books
        security_user: ["", Validators.required],
        is_staff: [false],
        is_active: [true, Validators.required]
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
        this.fg.get("identification_number")!.setValue(data.identification_number || '0000000')
        this.fg.get("code")!.setValue(data.code);
        this.fg.get("password")!.setValue(data.password);
        this.fg.get("email")!.setValue(data.email);
        this.fg.get("name")!.setValue(data.name);
        this.fg.get("last_name")!.setValue(data.last_name);
        if (security) {
          this.fg.get("security_user")!.setValue(security.id || null);
        }
        this.fg.get("type_user")!.setValue(data.type_user || "")
        this.fg.get("locations")!.setValue(data.locations?.map((l) => l.id) || [])
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
    if ((this.fg.value.password != this.fg.value.password2) && this.fg.value.password) {
      this.toastr.error("Las contraseñas no coinciden");
      return;
    }
    this.userService.add({ ...this.fg.value, oesvica_user: this.isOesvicaUser }).subscribe(
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
    if ((this.fg.value.password != this.fg.value.password2) && this.fg.value.password) {
      this.toastr.error("Las contraseñas no coinciden");
      return;
    }
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
    this.fg.get("locations")!.setValue([])
    this.disableOtherBooks = false
  }

  handleBooks() {
    if (this.fg.get("type_user")!.value === 3) {
      if (this.fg.get("locations")!.value.length === 1) {
        this.bookSelected = this.fg.get("locations")!.value[0]
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
