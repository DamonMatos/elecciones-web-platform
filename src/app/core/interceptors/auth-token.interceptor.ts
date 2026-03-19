import { HttpInterceptorFn } from '@angular/common/http';

// Interceptor encargado de adjuntar el token JWT almacenado en localStorage.
export const authTokenInterceptor: HttpInterceptorFn = (request, next) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return next(request);
  }

  const requestWithToken = request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(requestWithToken);
};
