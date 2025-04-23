import { BrowserModule } from "@angular/platform-browser";
import { APP_INITIALIZER, NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import {
  HashLocationStrategy,
  LocationStrategy,
  PathLocationStrategy,
} from "@angular/common";
import { AppRoutes } from "./app.routing";
import { AppComponent } from "./app.component";
import { Error401Interceptor } from "app/utils/interceptor";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FullComponent } from "./layouts/full/full.component";
import { AppHeaderComponent } from "./layouts/full/header/header.component";
import { AppSidebarComponent } from "./layouts/full/sidebar/sidebar.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DemoMaterialModule } from "./demo-material-module";
import { ComponentesModule } from "app/componentes/componentes.module";
import { SharedModule } from "./shared/shared.module";
import { MatTabsModule } from "@angular/material/tabs";
import { SpinnerComponent } from "./shared/spinner.component";
import { LoginComponent } from "app/seguridad/login/login.component";
import { ToastrModule } from "ngx-toastr";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import { MatNativeDateModule } from "@angular/material/core";
import { LayoutModule } from "@angular/cdk/layout";
import {
  NgxPermissionsGuard,
  NgxPermissionsModule,
  NgxPermissionsService,
} from "ngx-permissions";
import { getLocalStorage } from "./utils/localStorage";
import { PERMISSIONS } from "./constants";
import { decryptUsingAES256 } from './utils/crypt';
import { TestsComponent } from './tests/tests.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatSelectModule } from '@angular/material/select';
import { ViewNewLinkComponent } from "./modules/novedades/new/view-new-link/view-new-link.component";

const getPermissionsFromLocalStorage = () => {
  const permissionsCrypt = getLocalStorage(PERMISSIONS);
  if (permissionsCrypt) {
    const permissions = decryptUsingAES256(permissionsCrypt)
    return JSON.parse(permissions || '[]');
  }
  return [];
};

@NgModule({
  declarations: [
    AppComponent,
    FullComponent,
    AppHeaderComponent,
    SpinnerComponent,
    AppSidebarComponent,
    LoginComponent,
    TestsComponent,
    ViewNewLinkComponent
  ],
  imports: [
    BrowserModule,
    MatTabsModule,
    BrowserAnimationsModule,
    DemoMaterialModule,
    FormsModule,
    FlexLayoutModule.withConfig({
      useColumnBasisZero: false,
      printWithBreakpoints: ['md', 'lt-lg', 'lt-xl', 'gt-sm', 'gt-xs']
    }),
    HttpClientModule,
    SharedModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot(AppRoutes),
    ComponentesModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    LayoutModule,
    NgxPermissionsModule.forRoot(),
    NgxMaterialTimepickerModule,
    MatSelectModule,
  ],
  providers: [
    // { provide: LocationStrategy,  useClass: PathLocationStrategy},
    // { provide: APP_BASE_HREF, useValue: '/news-book-frontend/app' },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: Error401Interceptor, multi: true },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { floatLabel: "always" },
    },
    NgxPermissionsGuard,
    NgxPermissionsService,
    {
      provide: APP_INITIALIZER,
      useFactory: (ps: NgxPermissionsService) =>
        function () {
          return ps.loadPermissions(getPermissionsFromLocalStorage());
        },
      deps: [NgxPermissionsService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
