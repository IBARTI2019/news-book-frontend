import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { API } from './api';
import { getLocalStorage } from './localStorage';

@Injectable()
export class Error401Interceptor implements HttpInterceptor {
  constructor() {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = localStorage.getItem(API.TOKEN);
    if (token) token = token.replace(/"/g, "");

    let id_book = getLocalStorage(API.BOOK);
    let schema_name = localStorage.getItem(API.SCHEMA_NAME);

/*     if (request.url.includes('/type_news/') || request.url.includes('/client/') || request.url.includes('/domain/')){
        schema_name = "public"
    } */
    const req1 = request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`).set('location', `${id_book}`).set('X-Dts-Schema', schema_name || "public"),
    });

    return next.handle(req1).pipe(
      catchError(err => {
        // Ignorar token refresh si is_active es 0F
        if (err.is_active === 401 || (err.is_active === 0 && !req1.url.endsWith('token-refresh/'))) {
          //this.usuarioService.logout();
        }
        return throwError(err);
      }),
      map((response: any) => {
        if (response?.body?.error)
          throw new HttpErrorResponse({ error: { error: response.body.error, message: response.body.menssage } });
        return response
      })
    );
  }
  // you probably want to store it in localStorage or something
}
