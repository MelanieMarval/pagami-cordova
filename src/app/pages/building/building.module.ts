import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuildingPageRoutingModule } from './building-routing.module';

import { BuildingPage } from './building.page';
import { BackgroundEmptyModule } from '../../shared/background-empty/background-empty.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        BuildingPageRoutingModule,
        BackgroundEmptyModule,
    ],
  declarations: [BuildingPage]
})
export class BuildingPageModule {}
