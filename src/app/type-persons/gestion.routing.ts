import { _MatTabLinkBase } from '@angular/material/tabs';
import { Routes } from '@angular/router';
import { UsuarioCrearComponent } from './maestro/usuario-crear/usuario-crear.component';
import { UsuarioComponent } from './maestro/usuario.component';

export const GestionRoutes: Routes = [
    {
        path: 'maestro',
        children:[
            {
                path: "",
                data: {
                    breadcrumb: {
                        label: 'Usuario'
                    },
                    omitirPermiso:true
                },
                component: UsuarioComponent,
            },
            {
                path: "crear",
                data:{
                   breadcrumbAnt:{
                     label :"Usuario",
                     url:"type-persons/maestro" ,  
                     params:[]
                    },
                    breadcrumb: {
                        label: "Crear Usuario"
                    }, 
                    omitirPermiso:true
                },
                component: UsuarioCrearComponent
            }
        ]
    }
];
