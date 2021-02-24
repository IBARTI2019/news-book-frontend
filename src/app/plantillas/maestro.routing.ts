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
                        label: 'Plantilas'
                    },
                    omitirPermiso:true
                },
                component: UsuarioComponent,
            },
            {
                path: "crear",
                data:{
                   breadcrumbAnt:{
                     label :"Plantillas",
                     url:"plantillas/maestro" ,  
                     params:[]
                    },
                    breadcrumb: {
                        label: "Crear Plantillas"
                    }, 
                    omitirPermiso:true
                },
                component: UsuarioCrearComponent
            },
            {
                path: ":id",
                data:{
                   breadcrumbAnt:{
                     label :"Plantillas",
                     url:"plantillas/maestro" ,  
                     params:[]
                    },
                    breadcrumb: {
                        label: "Editar Plantillas"
                    }, 
                    omitirPermiso:true
                },
                component: UsuarioEditarComponent
            }
            
        ]
    }
];
