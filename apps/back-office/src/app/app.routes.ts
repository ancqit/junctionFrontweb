import { Routes } from '@angular/router';
import { App } from './app';
import { planActiveGuard } from './core/plan-active.guard';

export const APP_ROUTES: Routes = [
  {
    path: '',
    component: App,
    children: [
      {
        path: '',
        pathMatch: 'full',
        canActivate: [planActiveGuard],
        loadComponent: () => import('./features/overview/overview').then((m) => m.OverviewPage),
      },
      {
        path: 'employees',
        canActivate: [planActiveGuard],
        loadComponent: () => import('./features/employees/employees').then((m) => m.EmployeesPage),
      },
      {
        path: 'products',
        canActivate: [planActiveGuard],
        loadComponent: () => import('./features/products/products').then((m) => m.ProductsPage),
      },
      {
        path: 'billing',
        canActivate: [planActiveGuard],
        loadComponent: () => import('./features/billing/billing').then((m) => m.BillingPage),
      },
      {
        path: 'orders',
        canActivate: [planActiveGuard],
        loadComponent: () => import('./features/orders/orders').then((m) => m.OrdersPage),
      },
      {
        path: 'profile',
        canActivate: [planActiveGuard],
        loadComponent: () => import('./features/profile/profile').then((m) => m.ProfilePage),
      },
      {
        path: 'activate',
        loadComponent: () => import('./features/activate/activate').then((m) => m.ActivatePage),
      },
      {
        path: 'plans',
        loadComponent: () => import('./features/plans/plans').then((m) => m.PlansPage),
      },
    ],
  },
];

/** Used by the remote's own bootstrap when served standalone. */
export const routes = APP_ROUTES;
