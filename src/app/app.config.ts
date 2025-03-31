// import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
// import { provideRouter } from '@angular/router';
// import { AuthInterceptor } from './services/auth.interceptor';  // Ajusta la ruta según corresponda
// import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// import { routes } from './app.routes';

// export const appConfig: ApplicationConfig = {
//   providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)]
// };

import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { AuthInterceptor } from './services/auth.interceptor'; 
import { provideHttpClient, HTTP_INTERCEPTORS, withInterceptorsFromDi } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),  
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,  // Registrar el interceptor
      multi: true  // Importante para que se agregue a la cadena de interceptores
    },
    provideRouter(routes)
  ]
};