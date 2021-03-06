import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { OrdersPage } from './pages/orders/orders';

const routes: Routes = [
    // {
    //     path: '',
    //     redirectTo: 'tutorial',
    //     pathMatch: 'full'
    // },
    {
        path: 'tutorial',
        loadChildren: () => import('./pages/tutorial/tutorial.module').then(m => m.TutorialModule),
    },
    {
        path: 'terms',
        loadChildren: () => import('./pages/terms/terms.module').then(m => m.TermsModule),
    },
    {
        path: 'user-register',
        loadChildren: () => import('./pages/user-register/user-register.module').then(m => m.UserRegisterModule),
    },
    {
        path: 'admin',
        children: [
            {
                path: '',
                redirectTo: 'tabs',
                pathMatch: 'full',
            },
            {
                path: 'tabs',
                loadChildren: () => import('./pages/admin/tabs/tabs-admin.module').then(m => m.TabsModule),
            },
            {
                path: 'profile',
                loadChildren: () => import('./pages/admin/profile/profile.module').then(m => m.ProfileModule),
            },
            {
                path: 'invoice/:id',
                loadChildren: () => import('./pages/invoice/invoice.module').then( m => m.InvoicePageModule)
            },
        ],
    },
    {
        path: 'app',
        children: [
            {
                path: '',
                redirectTo: 'tabs',
                pathMatch: 'full',
            },
            {
                path: 'tabs',
                loadChildren: () => import('./pages/tabs/tabs-page.module').then(m => m.TabsModule),
            },
            {
                path: 'orders',
                loadChildren: () => import('./pages/orders/orders.module').then(m => m.OrdersModule),
            },
            {
                path: 'my-products',
                loadChildren: () => import('./pages/my-products/products.module').then(m => m.ProductsModule),
            },
            {
                path: 'my-services',
                loadChildren: () => import('./pages/my-services/services.module').then(m => m.ServicesModule),
            },
            {
                path: 'shop',
                loadChildren: () => import('./pages/shop/shop.module').then(m => m.ShopModule),
            },
            {
                path: 'business-claim',
                loadChildren: () => import('./pages/business-claim/business-claim.module').then(m => m.BusinessClaimModule),
            },
            {
                path: 'business-payment-details',
                loadChildren: () => import('./pages/business-details/business-details.module').then(m => m.BusinessDetailsModule),
            },
            {
                path: 'settings',
                loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsPageModule),
            },
            {
                path: 'invoice/:id',
                loadChildren: () => import('./pages/invoice/invoice.module').then( m => m.InvoicePageModule)
            },
            {
                path: '**',
                redirectTo: 'tabs',
                pathMatch: 'full',
            },
        ],
    },
    {
        path: '**',
        redirectTo: 'tabs',
        pathMatch: 'full',
    },


];

@NgModule({
    imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
    exports: [RouterModule],
})
export class AppRoutingModule {
}

