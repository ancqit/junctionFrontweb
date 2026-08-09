import { loadRemoteModule } from '@angular-architects/native-federation';
import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { authorGuard } from './core/author.guard';
import { Login } from './login/login';

export const routes: Routes = [
  { path: 'login', component: Login },
  {
    path: 'admin',
    canActivate: [authGuard, authorGuard('admin')],
    loadComponent: () => import('./admin/admin').then((m) => m.AdminPage),
  },
  {
    path: 'viewer',
    canActivate: [authGuard, authorGuard('viewer')],
    loadComponent: () => import('./viewer/viewer').then((m) => m.ViewerPage),
  },
  {
    path: 'back-office',
    canActivate: [authGuard, authorGuard(['owner', 'admin'])],
    loadChildren: () => loadRemoteModule('backOffice', './Routes').then((module) => module.APP_ROUTES),
  },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' },
];
