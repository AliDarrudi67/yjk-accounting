import { Routes } from '@angular/router';
import { AdminComponent } from '../admin/admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PrivateLayoutComponent } from './private-layout/private-layout.component';

export const PRIVATE_ROUTES: Routes = [
  {
    path: '',
    component: PrivateLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },

      {
        path: 'dashboard/admins',
        component: AdminComponent,
      },
    ],
  },
];
