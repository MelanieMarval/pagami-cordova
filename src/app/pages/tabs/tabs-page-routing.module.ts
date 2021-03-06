import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs-page';

const routes: Routes = [
    {
        path: '',
        component: TabsPage,
        children: [
            {
                path: '',
                redirectTo: 'map',
                pathMatch: 'full'
            },
            {
                path: 'map',
                loadChildren: () => import('./map/map.module').then(m => m.MapModule)
            },
            {
                path: 'wallet',
                loadChildren: () => import('./wallet/wallet.module').then(m => m.WalletModule)
            },
            {
                path: 'wallet/activity',
                loadChildren: () => import('./activity/activity.module').then(m => m.ActivityModule)
            },
            {
                path: 'building',
                loadChildren: () => import('../building/building.module').then(m => m.BuildingPageModule),
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TabsPageRoutingModule {
}

