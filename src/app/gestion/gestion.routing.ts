import { Routes } from '@angular/router';
import { UsuarioComponent } from './usuario/usuario.component';

export const GestionRoutes: Routes = [
    {
        path: 'usuario',
        data: {
            breadcrumbAnt: {
                label: "Inicio",
                url: 'inicio'
            },
            breadcrumb: {
                label: 'Usuario'
            }
        },
        component: UsuarioComponent
    }
];
