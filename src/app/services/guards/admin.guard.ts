import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const userRole = sessionStorage.getItem('rol');

    if (userRole !== 'admin') {
        router.navigate(['/']);
        return false;
    }

    return true;
};
