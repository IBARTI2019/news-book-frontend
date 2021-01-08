import { _MatTabLinkBase } from '@angular/material/tabs';
import { Routes } from '@angular/router';
import { UsuarioCrearComponent } from './maestro/usuario-crear/usuario-crear.component';
import { UsuarioComponent } from './maestro/usuario.component';
import { UsuarioEditarComponent } from './maestro/usuario-editar/usuario-editar.component';

export const GestionRoutes: Routes = [
    {
        path: 'maestro',
        children:[
            {
                path: "",
                data: {
                    breadcrumb: {
                        label: 'Personas'
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
                     url:"personas/maestro" ,  
                     params:[]
                    },
                    breadcrumb: {
                        label: "Crear Personas"
                    }, 
                    omitirPermiso:true
                },
                component: UsuarioCrearComponent
            },
            {
                path: "editar",
                data:{
                   breadcrumbAnt:{
                     label :"Personas",
                     url:"personas/maestro" ,  
                     params:[]
                    },
                    breadcrumb: {
                        label: "Editar Personas"
                    }, 
                    omitirPermiso:true
                },
                component: UsuarioEditarComponent
            }
            
        ]
    }
];
