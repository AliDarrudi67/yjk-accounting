// src/app/core/interceptors/auth-error.interceptor.ts

import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log(error);
      if (error.status === 401) {
        localStorage.clear();
        location.reload();
      }

      return throwError(() => error);
    }),
  );
};
