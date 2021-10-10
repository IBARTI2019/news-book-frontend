import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogService } from '../../../componentes/confirm-dialog/confirm-dialog.service';
import { GenericTableComponent } from "../../../componentes/generic-table/generic-table.component";
import { DTColumn } from "../../../componentes/generic-table/interface";
import { Book } from '../../../interfaces';
import { BooksService } from "../../../services/books.service";

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {
  @ViewChild("table") table!: GenericTableComponent;
  columns: DTColumn[] = [];
  constructor(
    public booksService: BooksService,
    private router: Router,
    private dialogService: ConfirmDialogService,
    private toastr: ToastrService
  ) { }

  showCheck = () => true;

  ngOnInit(): void {
    this.columns = [
      {
        dataAttribute: "code",
        attribute: "Código",
      },
      {
        dataAttribute: "name",
        attribute: "Nombre",
      },
      {
        dataAttribute: "phone1",
        attribute: "Telefono 1",
      },
      {
        dataAttribute: "phone2",
        attribute: "Telefono 2",
      },
      {
        dataAttribute: "is_active",
        attribute: "Activo",
        type: "bool"
      },
      {
        attribute: "id",
        header: "Opciones",
        template: "opciones",
        default: 'false'
      },
    ];
  }

  update(id: string) {
    this.router.navigate(["locations", id]);
  }

  delete(book: Book) {
    this.dialogService.open({
      message: `Esta seguro de que desea eliminar La Informacion de ${book.name}?`,
    });
    this.dialogService.confirmed().subscribe((confirmed) => {
      if (confirmed) {
        this.booksService.remove(book.id || '').subscribe(
          (data) => {
            this.toastr.success("book eliminado con exito!.");
            this.table.refresh();
          },
          (error: HttpErrorResponse) => {
            this.toastr.error(
              error.error.mesaage ||
              "No se logro eliminar el book"
            );
          }
        );
      }
    });
  }
}
