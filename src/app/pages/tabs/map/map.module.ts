import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Modules
import { MapRoutingModule } from './map-routing.module';
import { IonBottomDrawerModule } from '../../../shared/ion-bottom-drawer/ion-bottom-drawer.module';
import { AvatarHeaderModule } from '../../../shared/avatar-header/avatar-header.module';
import { PipesModule } from '../../../pipes/pipes.module';
// Components
import { NearbyPage } from './nearby/nearby';
import { MapPage } from './map-page';

@NgModule({
    declarations: [
        MapPage,
        NearbyPage
    ],
    imports: [
        CommonModule,
        IonicModule,
        FormsModule,
        MapRoutingModule,
        IonBottomDrawerModule,
        AvatarHeaderModule,
        PipesModule,
    ],
    providers: []
})
export class MapModule {
}
