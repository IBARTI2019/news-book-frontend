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
                        label: 'Type Persons'
                    },
                    omitirPermiso:true
                },
                component: UsuarioComponent,
            },
            {
                path: "crear",
                data:{
                   breadcrumbAnt:{
                     label :"Type Persons",
                     url:"type-persons/maestro" ,  
                     params:[]
                    },
                    breadcrumb: {
                        label: "Crear Type Persons"
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
                     url:"type-persons/maestro" ,  
                     params:[]
                    },
                    breadcrumb: {
                        label: "Editar Type Persons"
                    }, 
                    omitirPermiso:true
                },
                component: UsuarioEditarComponent
            }
            
        ]
    }
];
