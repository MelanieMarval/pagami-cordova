import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ApiResponse } from '../../../core/api/api.response';
import { PlacesService } from '../../../core/api/places/places.service';
import { ClaimService } from '../../../core/api/claim/claim.service';

@Component({
    selector: 'app-tabs-admin',
    templateUrl: 'tabs-admin.html',
    styleUrls: ['tabs-admin.scss']
})
// tslint:disable-next-line:component-class-suffix
export class TabsAdmin implements OnInit {

    showNotification = 0;

    constructor(private placesService: PlacesService,
                private claimService: ClaimService) {
    }

    ngOnInit() { }

    ionViewWillEnter() {
        this.placesService.getAllWaiting()
            .then((success: ApiResponse) => {
                console.log('-> success', success);
                if (success.passed) {
                    this.showNotification += success.response.length;
                }
            });
        this.claimService.getWaiting()
            .then((success: ApiResponse) => {
                console.log('-> success', success);
                if (success.passed) {
                    this.showNotification += success.response.length;
                }
            });
    }
}
