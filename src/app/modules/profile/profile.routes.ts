import { Routes } from '@angular/router';

export default [
  { path: '', redirectTo: '', pathMatch: 'full' },
  {
    path: '',
    loadComponent: () => import('./pages/profile/profile.component'),
  },
] as Routes;
