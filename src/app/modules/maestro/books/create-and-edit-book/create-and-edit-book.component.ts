import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Book } from 'app/interfaces';
import { BooksService } from 'app/services/books.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-and-edit-book',
  templateUrl: './create-and-edit-book.component.html',
  styleUrls: ['./create-and-edit-book.component.css']
})
export class CreateAndEditBookComponent implements OnInit {
  fg: FormGroup;
  submitted = false;
  update = false;
  id = "";
  routeState: any;
  redirectTo = "";

  constructor(
    private booksService: BooksService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.fg = this.fb.group({});
    this.routeState = history.state
  }

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this.redirectTo = this.routeState.redirectTo || ""

    this.fg = this.fb.group(
      {
        code: ["", Validators.required],
        name: ["", Validators.required],
        phone1: [""],
        phone2: [""],
        is_active: [true, Validators.required],
      },
      {}
    );
    if (this.id) {
      this.update = true;
      this.getBook();
    }
  }

  onSubmit() {
    if (this.fg.invalid) {
      return;
    }
    this.submitted = true;
    this.update ? this.updateBook() : this.save();
  }

  onReset() {
    this.submitted = false;
    this.fg.reset();
    this.router.navigate([this.redirectTo || "Books"]);
  }

  save() {
    this.booksService.add(this.fg.value).subscribe(
      (data) => {
        this.toastr.success("Libro creado con éxito");
        this.submitted = false;
        this.fg.reset();
        this.router.navigate([this.redirectTo || "locations"]);
      },
      (error: HttpErrorResponse) => {
        this.submitted = false;
        this.toastr.error(error.error.message || "No se pudo crear los datos");
      }
    );
  }

  getBook() {
    this.booksService.get(this.id).subscribe((data: Book) => {
      this.fg.get("code")!.setValue(data.code);
      this.fg.get("name")!.setValue(data.name);
      this.fg.get("phone1")!.setValue(data.phone1);
      this.fg.get("phone2")!.setValue(data.phone2);
      this.fg.get("is_active")!.setValue(data.is_active);
    },
      (error: HttpErrorResponse) => {
        this.toastr.error(error.error.message || 'Error al obtener el libro');
      }
    );
  }

  updateBook() {
    this.booksService.update(this.id, this.fg.value).subscribe(
      (data) => {
        this.toastr.success("Datos del Libro actualizados");
        this.submitted = false;
        this.fg.reset();
        this.router.navigate(["locations"]);
      },
      (error: HttpErrorResponse) => {
        this.submitted = false;
        this.toastr.error(
          error.error.message || "No se logro actualizar el libro"
        );
      }
    );
  }
}
