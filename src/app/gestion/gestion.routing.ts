import { _MatTabLinkBase } from '@angular/material/tabs';
import { Routes } from '@angular/router';
import { UsuarioCrearComponent } from './usuario/usuario-crear/usuario-crear.component';
import { UsuarioComponent } from './usuario/usuario.component';

export const GestionRoutes: Routes = [
    {
        path: 'usuario',
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
                     url:"gestion/usuario" ,  
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
