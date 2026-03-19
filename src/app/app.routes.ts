import { Routes } from '@angular/router';
import { LoginComponent } from './features/usuario/login/login.component';
import { ShellComponent } from './layout/shell/shell.component';
import { NopagefoundComponent } from './features/nopagefound/nopagefound/nopagefound.component';
import { RegistroComponent } from './features/usuario/registro/registro.component';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';

export const routes: Routes = [
    {
        path: '',
        canActivate: [guestGuard],
        component: LoginComponent
    },
    {
        path: 'login',
        canActivate: [guestGuard],
        component: LoginComponent
    },
    {
        path: 'registro',
        canActivate: [guestGuard],
        component: RegistroComponent
    },

    {
        path: '',
        component: ShellComponent,
        children: [
            {
                path: 'perfil',
                canActivate: [authGuard],
                loadComponent: () =>
                import('./features/pages/perfil/perfil.component').then(m => m.PerfilComponent)
            }
        ]
    },
    {
        path: 'configuracion',
        component: ShellComponent,
        children: [
            {
                path: 'proceso',
                canActivate: [authGuard],
                loadComponent: () =>
                import('./features/pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
            },
            {
                path: 'candidato',
                loadComponent: () =>
                import('./features/pages/eleccion/eleccion.component').then(m => m.EleccionComponent)
            }
        ]
    },

    {
        path: 'dashboard',
        component: ShellComponent,
        children: [
            {
                path: 'barra',
                canActivate: [authGuard],
                loadComponent: () =>
                import('./features/pages/eleccion/eleccion.component').then(m => m.EleccionComponent)
            }
        ]
    },
    { path: '**', component: NopagefoundComponent }
];