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
                        label: 'Lista Email'
                    },
                    skipPermission:true
                },
                component: UsuarioComponent,
            },
            {
                path: "crear",
                data:{
                   breadcrumbAnt:{
                     label :"Lista Email",
                     url:"listemail/maestro" ,  
                     params:[]
                    },
                    breadcrumb: {
                        label: "Crear List Email"
                    }, 
                    skipPermission:true
                },
                component: UsuarioCrearComponent
            },
            {
                path: ":id",
                data:{
                   breadcrumbAnt:{
                     label :"Lista Email",
                     url:"listemail/maestro" ,  
                     params:[]
                    },
                    breadcrumb: {
                        label: "Editar List Emails"
                    }, 
                    skipPermission:true
                },
                component: UsuarioEditarComponent
            }
            
        ]
    }
];
