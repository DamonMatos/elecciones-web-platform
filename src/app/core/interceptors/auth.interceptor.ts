import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpResponse } from '@angular/common/http';
import { inject }        from '@angular/core';
import { tap }           from 'rxjs/operators';
import { AuthStorageService } from '../services/auth-storage.service';
import { UsuarioMenuResponse } from '../../features/usuario/registro/models/usuario.model';

const AUTH_ENDPOINTS = ['/auth', '/user/register'];

export const authInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,next: HttpHandlerFn) => {

    const authStorage = inject(AuthStorageService);

    const token = localStorage.getItem('token');   
    const authReq = token? req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
        }): req;
        
    return next(authReq).pipe(tap(event => {
        if (!(event instanceof HttpResponse)) return;
        
        const isAuthEndpoint = AUTH_ENDPOINTS.some(endpoint =>
            req.url.includes(endpoint)
        );
        
        if (isAuthEndpoint && event.status === 200) {
            const body = event.body as UsuarioMenuResponse;
        
                if (body?.user && body?.token) {
                authStorage.saveSession(body);
                console.log('Sesión guardada:', authStorage.getUser()?.correo);
                }
            }
        })
    );
}