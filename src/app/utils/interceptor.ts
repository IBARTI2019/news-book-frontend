import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { UsuarioService } from 'app/seguridad/servicios/usuario.service';
import { Router } from '@angular/router';
import { API } from './api';

@Injectable()
export class Error401Interceptor implements HttpInterceptor {
  constructor(private usuarioService: UsuarioService, private router: Router) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem(API.TOKEN);
    const req1 = request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`),
    });
    return next.handle(req1).pipe(catchError(err => {
      // Ignorar token refresh si status es 0F
      if (err.status === 401 || (err.status === 0 && !req1.url.endsWith('token-refresh/'))) {
        //this.usuarioService.logout();
      }
      return throwError(err);
    }));
  }
  // you probably want to store it in localStorage or something

}
