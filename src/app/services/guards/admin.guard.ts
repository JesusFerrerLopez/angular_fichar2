import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    console.log('adminGuard ACTIVADO'); // 🔴 Agrega este mensaje para verificar si se ejecuta.

    const userRole = sessionStorage.getItem('rol');
    console.log('Rol del usuario:', userRole); // 🔴 Agrega este mensaje para ver el valor de `rol`

    if (userRole !== 'admin') {
        console.warn('Acceso denegado, redirigiendo...'); // 🔴 Mensaje de advertencia
        router.navigate(['/']);
        return false;
    }

    console.log('Acceso permitido'); // 🔴 Mensaje si es admin
    return true;
};
