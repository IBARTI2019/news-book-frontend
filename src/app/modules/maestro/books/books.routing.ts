import { Routes } from "@angular/router";
import { _MatTabLinkBase } from "@angular/material/tabs";
import { NgxPermissionsGuard } from "ngx-permissions";
import { ADMIN, SUPERVISOR, USER } from "../../../constants";
import { BooksComponent } from "./books.component";
import { CreateAndEditBookComponent } from "./create-and-edit-book/create-and-edit-book.component";

export const BooksRouting: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ADMIN, USER, SUPERVISOR],
            redirectTo: "/",
          },
          breadcrumb: {
            label: "Libros",
          },
        },
        component: BooksComponent,
      },
      {
        path: "crear",
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ADMIN, USER, SUPERVISOR],
            redirectTo: "/",
          },
          breadcrumbAnt: {
            label: "Libros",
            url: "locations",
            params: [],
          },
          breadcrumb: {
            label: "Crear Libro",
          },
        },
        component: CreateAndEditBookComponent,
      },
      {
        path: ":id",
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ADMIN, USER, SUPERVISOR],
            redirectTo: "/",
          },
          breadcrumbAnt: {
            label: "Libros",
            url: "locations",
            params: [],
          },
          breadcrumb: {
            label: "Editar Libro",
          },
        },
        component: CreateAndEditBookComponent,
      },
    ],
  },
];
