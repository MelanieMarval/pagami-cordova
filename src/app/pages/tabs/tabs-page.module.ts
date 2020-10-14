import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { TabsPage } from './tabs-page';
import { TabsPageRoutingModule } from './tabs-page-routing.module';

import { AvatarHeaderModule } from '../../shared/avatar-header/avatar-header.module';
import { PipesModule } from '../../pipes/pipes.module';
import { ImageTooltipsModule } from '../../shared/image-tooltips/image-tooltips.module';

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        TabsPageRoutingModule,
        AvatarHeaderModule,
        PipesModule,
        ImageTooltipsModule
    ],
    declarations: [
        TabsPage,
    ],
    providers: []
})
export class TabsModule {
}
