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
    // Viewer = post-grace deactivated account → same Activate view in the app.
    path: 'viewer',
    canActivate: [authGuard, authorGuard('viewer')],
    redirectTo: 'back-office/activate',
    pathMatch: 'full',
  },
  {
    path: 'back-office',
    // Viewers may enter the deactivated Activate + Plans area; owners/admins get the full app.
    canActivate: [authGuard, authorGuard(['owner', 'admin', 'viewer'])],
    loadChildren: () => loadRemoteModule('backOffice', './Routes').then((module) => module.APP_ROUTES),
  },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' },
];
