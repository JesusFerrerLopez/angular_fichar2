import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

// INTERCEPTOR DE AUTENTICACIÓN
/*
  Este interceptor se encarga de agregar el token de autorización a cada solicitud HTTP
  y manejar los errores relacionados con la autenticación.
*/
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Clonamos la solicitud para agregar el encabezado de autorización
  const cloned = req.clone({
    setHeaders: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}` || ''
    }
  });
  // Pasamos la solicitud clonada al siguiente manejador
  return next(cloned).pipe(
    // Manejo de errores
    catchError((error) => {
      if (error.status === 401) {
        // Si la respuesta es 401, redirigimos al usuario a la página de inicio de sesión
        window.location.href = '/login';
      }
      return throwError(error);
    })
  );
};
