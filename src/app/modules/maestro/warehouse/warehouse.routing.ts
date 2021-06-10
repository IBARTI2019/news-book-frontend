import { _MatTabLinkBase } from '@angular/material/tabs';
import { Routes } from '@angular/router';
import { CreateAndEditComponent } from './create-and-edit/create-and-edit.component';
import { WarehouseComponent } from './warehouse.component';

export const WarehouseRoutes: Routes = [
    {
        path: '',
        children:[
            {
                path: '',
                data: {
                    breadcrumb: {
                        label: 'Almacen',
                    },
                    skipPermission:true,
                },
                component: WarehouseComponent,
            },
            {
                path: "crear",
                data:{
                   breadcrumbAnt:{
                        label: "Almacen",
                        url: "warehouse" ,  
                        params: [],
                    },
                    breadcrumb: {
                        label: "Crear Almacen"
                    }, 
                    skipPermission:true,
                },
                component: CreateAndEditComponent,
            },
            {
                path: ":id",
                data:{
                   breadcrumbAnt:{
                     label :"Almacen",
                     url:"warehouse" ,
                     params:[],
                    },
                    breadcrumb: {
                        label: "Editar Almacen",
                    }, 
                    skipPermission:true,
                },
                component: CreateAndEditComponent,
            },
        ]
    },
];
