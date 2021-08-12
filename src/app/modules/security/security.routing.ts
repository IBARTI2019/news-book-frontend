import { Routes } from '@angular/router';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { UserComponent } from './user/user.component';

export const SecurityRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'user',
                children: [
                    {
                        path: '',
                        component: UserComponent
                    },
                    {
                        path: 'crear',
                        component: UserEditComponent
                    },
                    {
                        path: ':id',
                        component: UserEditComponent
                    }
                ]
            }
        ]
    },
];
