import { inject }        from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router }       from '@angular/router';
import { AuthStorageService } from '../core/services/auth-storage.service';

export const guestGuard: CanActivateFn = () => {
    const authStorage = inject(AuthStorageService);
    const router      = inject(Router);
    
    if (!authStorage.isLoggedIn()) {
        return true; 
    }
    
    return router.createUrlTree(['/admin/dashboard']);
};