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
                    omitirPermiso:true,
                },
                component: WarehouseComponent,
            },
            {
                path: "crear",
                data:{
                   breadcrumbAnt:{
                        label: "Almacen",
                        url: "inicio/warehouse/" ,  
                        params: [],
                    },
                    breadcrumb: {
                        label: "Crear Almacen"
                    }, 
                    omitirPermiso:true,
                },
                component: CreateAndEditComponent,
            },
            {
                path: ":id",
                data:{
                   breadcrumbAnt:{
                     label :"Almacen",
                     url:"inicio/warehouse/" ,
                     params:[],
                    },
                    breadcrumb: {
                        label: "Editar Almacen",
                    }, 
                    omitirPermiso:true,
                },
                component: CreateAndEditComponent,
            },
        ]
    },
];
