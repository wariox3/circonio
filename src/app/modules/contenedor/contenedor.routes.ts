import { Routes } from '@angular/router';

export default [
  { path: '', redirectTo: '', pathMatch: 'full' },
  {
    path: '',
    loadComponent: () => import('./pages/contenedor/contenedor.component'),
  },
] as Routes;
