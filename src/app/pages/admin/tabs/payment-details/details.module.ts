import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// Modules
import { PipesModule } from '../../../../pipes/pipes.module';
import { BackgroundEmptyModule } from '../../../../shared/background-empty/background-empty.module';
import { SkeletonRecordsModule } from '../../../../shared/skeleton-records/skeleton-records.module';
// Pages
import { DetailsPage } from './details';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        HttpClientModule,
        FormsModule,
        RouterModule.forChild([
            {path: '', component: DetailsPage},
        ]),
        PipesModule,
        BackgroundEmptyModule,
        SkeletonRecordsModule,
    ],
    declarations: [DetailsPage]
})
export class PaymentDetailsModule {
}
