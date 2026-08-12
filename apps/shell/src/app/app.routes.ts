import { loadRemoteModule } from '@angular-architects/native-federation';
import { inject } from '@angular/core';
import { RedirectFunction, Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { homePathForRole } from './core/auth.models';
import { authorGuard } from './core/author.guard';
import { SessionService } from './core/session.service';
import { TokenService } from './core/token.service';
import { Login } from './login/login';
import { RemoteLoadErrorPage } from './remote-load-error';

/** Authenticated users land on their role home; everyone else on login. */
const redirectHome: RedirectFunction = () => {
  const tokens = inject(TokenService);
  const session = inject(SessionService);
  if (tokens.isAuthenticated) {
    return homePathForRole(session.role ?? 'owner').replace(/^\//, '');
  }
  return 'login';
};

async function loadBackOfficeRoutes(): Promise<Routes> {
  try {
    const module = await loadRemoteModule('backOffice', './Routes');
    return module.APP_ROUTES as Routes;
  } catch (firstError) {
    console.error('back-office remote load failed, retrying once', firstError);
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const module = await loadRemoteModule('backOffice', './Routes');
      return module.APP_ROUTES as Routes;
    } catch (secondError) {
      console.error('back-office remote load failed after retry', secondError);
      // Stay authenticated — do not fall back to previous URL (/login).
      return [
        {
          path: '',
          component: RemoteLoadErrorPage,
        },
        {
          path: '**',
          component: RemoteLoadErrorPage,
        },
      ];
    }
  }
}

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
    loadChildren: () => loadBackOfficeRoutes(),
  },
  { path: '', pathMatch: 'full', redirectTo: redirectHome },
  { path: '**', redirectTo: redirectHome },
];
