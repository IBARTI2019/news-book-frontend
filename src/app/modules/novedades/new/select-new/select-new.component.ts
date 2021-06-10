import { HttpErrorResponse } from "@angular/common/http";
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ConfirmDialogService } from "app/componentes/confirm-dialog/confirm-dialog.service";
import { TypeNew } from "app/interfaces";
import { TypeNewService } from "app/services/type-new.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-select-new",
  templateUrl: "./select-new.component.html",
  styleUrls: ["./select-new.component.css"],
})
export class SelectNewComponent implements OnInit {
  typeNews: TypeNew[] = [];

  constructor(
    public typeNewService: TypeNewService,
    private router: Router,
    private dialogService: ConfirmDialogService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.deleteStorageItem('id_user')
    this.typeNewService.list().subscribe(
      (typeNewsResponse: TypeNew[]) => {
        this.typeNews = [...typeNewsResponse];
        this.typeNews.shift()
      },
      (error: HttpErrorResponse) => {
        this.toastr.error(
          error.error.message || "Error obteniendo los Tipos de Novedades."
        );
      }
    );
  }

  private deleteStorageItem(fieldName: string) {
    if (fieldName) localStorage.removeItem(fieldName)
  }
}
