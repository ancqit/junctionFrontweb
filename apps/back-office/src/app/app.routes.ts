import { Routes } from '@angular/router';
import { App } from './app';

export const APP_ROUTES: Routes = [
  {
    path: '',
    component: App,
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./features/overview/overview').then((m) => m.OverviewPage),
      },
      {
        path: 'employees',
        loadComponent: () => import('./features/employees/employees').then((m) => m.EmployeesPage),
      },
      {
        path: 'products',
        loadComponent: () => import('./features/products/products').then((m) => m.ProductsPage),
      },
    ],
  },
];

/** Used by the remote's own bootstrap when served standalone. */
export const routes = APP_ROUTES;
