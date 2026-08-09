import { loadRemoteModule } from '@angular-architects/native-federation';
import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { Login } from './login/login';

export const routes: Routes = [
  { path: 'login', component: Login },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () => import('./admin/admin').then((m) => m.AdminPage),
  },
  {
    path: 'back-office',
    canActivate: [authGuard],
    loadChildren: () => loadRemoteModule('backOffice', './Routes').then((module) => module.APP_ROUTES),
  },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' },
];
