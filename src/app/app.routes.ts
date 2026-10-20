import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // ورود مستقیم → dashboard
  {
    path: '',
    redirectTo: 'private/dashboard',
    pathMatch: 'full',
  },

  // بخش خصوصی
  {
    path: 'private',
    canMatch: [authGuard],
    loadChildren: () =>
      import('./private/private.routes').then((m) => m.PRIVATE_ROUTES),
  },

  // صفحه لاگین
  {
    path: 'login',
    loadChildren: () =>
      import('./public/public.routes').then((m) => m.PUBLIC_ROUTES),
  },

  { path: '**', redirectTo: '' },
];
