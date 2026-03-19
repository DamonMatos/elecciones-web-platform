import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

// Interceptor que captura errores globales para centralizar el manejo y evitar duplicidad.
export const errorHandlerInterceptor: HttpInterceptorFn = (request, next) =>
  next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      // Centralizamos el log mientras se define un servicio de notificaciones.
      console.error('Error HTTP interceptado:', error);
      return throwError(() => error);
    })
  );
