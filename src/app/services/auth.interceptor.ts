import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Obtener el token de sessionStorage
    const token = sessionStorage.getItem('token');

    // Si el token existe, agregarlo a los encabezados de la solicitud
    if (token) {
      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        }
      });

      // Continuar con la solicitud clonada que tiene el token en los headers
      return next.handle(clonedRequest);
    }

    // Si no hay token, pasar la solicitud sin modificaciones
    return next.handle(req);
  }
}