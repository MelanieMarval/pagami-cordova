import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsPage } from './settings.page';

const routes: Routes = [
    {
        path: '',
        component: SettingsPage,
    },
    {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
    },
    {
        path: 'my-business',
        loadChildren: () => import('./my-business/my-business.module').then(m => m.MyBusinessModule)
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SettingsPageRoutingModule {
}
