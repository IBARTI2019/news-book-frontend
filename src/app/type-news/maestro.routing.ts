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
                        label: 'Type News'
                    },
                    omitirPermiso:true
                },
                component: UsuarioComponent,
            },
            {
                path: "crear",
                data:{
                   breadcrumbAnt:{
                     label :"Type News",
                     url:"type-news/maestro" ,  
                     params:[]
                    },
                    breadcrumb: {
                        label: "Crear Type News"
                    }, 
                    omitirPermiso:true
                },
                component: UsuarioCrearComponent
            },
            {
                path: "editar",
                data:{
                   breadcrumbAnt:{
                     label :"Type News",
                     url:"type-news/maestro" ,  
                     params:[]
                    },
                    breadcrumb: {
                        label: "Editar Type News"
                    }, 
                    omitirPermiso:true
                },
                component: UsuarioEditarComponent
            }
            
        ]
    }
];
