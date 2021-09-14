import { Routes } from "@angular/router";
import { TestComponent } from "./test/test.component";

export const DynamicFormsRouting: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        data: {
          breadcrumb: {
            label: "Test Formularios Dinámicos",
          },
        },
        component: TestComponent,
      }
    ],
  },
];
