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
                     label :"Personas",
                     url:"personas/maestro" ,  
                     params:[]
                    },
                    breadcrumb: {
                        label: "Crear Persona"
                    }, 
                    omitirPermiso:true
                },
                component: UsuarioCrearComponent
            }
        ]
    }
];
