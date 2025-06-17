import { Routes } from '@angular/router';
import { authGuard } from '@app/common/guards/auth.guard';

export default [
  {
    path: '',
    redirectTo: 'perfil',
    pathMatch: 'full',
  },
  {
    path: 'perfil',
    canActivate: [authGuard],
    loadComponent: () => import('./admin-layout/admin-layout.component'),
    children: [
      {
        path: '',
        loadChildren: () => import('../modules/profile/profile.routes'),
      },
    ],
  },
  {
    path: 'seguridad',
    canActivate: [authGuard],
    loadComponent: () => import('./admin-layout/admin-layout.component'),
    children: [
      {
        path: '',
        loadChildren: () => import('../modules/securidad/seguridad.routes'),
      },
    ],
  },
  {
    path: 'contenedor',
    canActivate: [authGuard],
    loadComponent: () => import('./admin-layout/admin-layout.component'),
    children: [
      {
        path: '',
        loadChildren: () => import('../modules/contenedor/contenedor.routes'),
      },
    ],
  },
] as Routes;
