import { Routes } from "@angular/router";
import { FormatGeneratorComponent } from "./format-generator/format-generator.component";
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
      },
      {
        path: "generator",
        data: {
          breadcrumb: {
            label: "Generador de Formatos",
          },
        },
        component: FormatGeneratorComponent,
      }
    ],
  },
];
