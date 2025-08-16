import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'lista-tareas',
    pathMatch: 'full',
  },
  {
    path: 'lista-tareas',
    loadComponent: () => import('./pages/lista-tareas/lista-tareas.page').then( m => m.ListaTareasPage)
  },
];
