import { Routes } from '@angular/router';
import { LoginComponent } from './features/usuario/login/login.component';
import { ShellComponent } from './layout/shell/shell.component';
import { NopagefoundComponent } from './features/nopagefound/nopagefound/nopagefound.component';
import { RegistroComponent } from './features/usuario/registro/registro.component';

export const routes: Routes = [
    {
        path: '',
        component: LoginComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'registro',
        component: RegistroComponent
    },
    {
    path: 'admin',
    component: ShellComponent,
    children: [
            {
                path: 'dashboard',
                loadComponent: () =>
                import('./features/pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
            },
            {
                path: 'elecciones',
                loadComponent: () =>
                import('./features/pages/eleccion/eleccion.component').then(m => m.EleccionComponent)
            }
        ]
    },
    {
    path: 'eleccion',
    component: ShellComponent,
    children: [
            {
                path: 'elecciones',
                loadComponent: () =>
                import('./features/pages/eleccion/eleccion.component').then(m => m.EleccionComponent)
            }
        ]
    },
    { path: '**', component: NopagefoundComponent }

    // {
    //     path: '',
    //     redirectTo: 'login',
    //     pathMatch: 'full'
    // },
    // {
    //     path: 'login',
    //     loadComponent: () => import('./features/usuario/login/login.component').then(m => m.LoginComponent)
    // },
    // {
    //     path: 'registro',
    //     loadComponent: () => import('./features/usuario/registro/registro.component').then(m => m.RegistroComponent)
    // },
    // {
    //     path: '**',
    //     redirectTo: 'login',

    // }
];