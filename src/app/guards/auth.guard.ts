import { inject }        from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router }        from '@angular/router';
import { AuthStorageService } from '../core/services/auth-storage.service';

  export const authGuard: CanActivateFn = () => {
  const authStorage = inject(AuthStorageService);
  const router      = inject(Router);
  
    if (authStorage.isLoggedIn()) {
      return true; // ✅ tiene token válido — puede acceder
    }
  
    // ❌ sin sesión o token expirado → redirigir al login
    authStorage.clearSession();
    return router.createUrlTree(['/login']);
};
    
