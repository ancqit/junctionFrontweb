import { loadRemoteModule } from '@angular-architects/native-federation';
import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { adminGuard, ownerGuard, viewerGuard } from './core/role.guard';
import { Login } from './login/login';

export const routes: Routes = [
  { path: 'login', component: Login },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./admin/admin').then((m) => m.AdminPage),
  },
  {
    path: 'viewer',
    canActivate: [authGuard, viewerGuard],
    loadComponent: () => import('./viewer/viewer').then((m) => m.ViewerPage),
  },
  {
    path: 'back-office',
    canActivate: [authGuard, ownerGuard],
    loadChildren: () => loadRemoteModule('backOffice', './Routes').then((module) => module.APP_ROUTES),
  },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' },
];
