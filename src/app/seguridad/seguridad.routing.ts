import { _MatTabLinkBase } from '@angular/material/tabs';
import { Routes } from '@angular/router';
import { UsuarioCrearComponent } from './usuario/usuario-crear/usuario-crear.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { UsuarioEditarComponent } from './usuario/usuario-editar/usuario-editar.component';

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
                     url:"seguridad/usuario" ,  
                     params:[]
                    },
                    breadcrumb: {
                        label: "Crear Usuario"
                    }, 
                    omitirPermiso:true
                },
                component: UsuarioCrearComponent
            },
            {
                path: "editar",
                data:{
                   breadcrumbAnt:{
                     label :"Usuario",
                     url:"seguridad/usuario" ,  
                     params:[]
                    },
                    breadcrumb: {
                        label: "Editar Usuario"
                    }, 
                    omitirPermiso:true
                },
                component: UsuarioEditarComponent
            }
            
        ]
    }
];
