import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { API } from './api';

@Injectable()
export class Error401Interceptor implements HttpInterceptor {
  constructor() {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem(API.TOKEN);
    const req1 = request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`),
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
        console.log(response)
        if (response?.body?.error)
          throw new HttpErrorResponse({ error: { error: response.body.error, message: response.body.menssage } });
        return response
      })
    );
  }
  // you probably want to store it in localStorage or something
}
