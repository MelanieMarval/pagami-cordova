import { Component, OnInit } from '@angular/core';
import { StorageProvider } from '../../providers/storage.provider';
import { User } from '../../core/api/users/user';
import { Router } from '@angular/router';
import { PlacesService } from '../../core/api/places/places.service';
import { Sim } from '@ionic-native/sim/ngx';

@Component({
    selector: 'app-terms',
    templateUrl: 'terms.html',
    styleUrls: ['terms.scss']
})
export class TermsPage implements OnInit {

    user: User;
    termsAccepted = false;

    constructor(private storageService: StorageProvider,
                private route: Router,
                private placesService: PlacesService,
                private sim: Sim) {
    }

    async ngOnInit() {
        this.user = await this.storageService.getUserUnregistered();
        this.setLocation();
    }

    private setLocation() {
        let countries = [];
        this.placesService.getAllCountries().then(value => {
            countries = value;
            const country = countries.find(cc => cc.code === 'CO');
            this.user.phoneCode = country.dial_code;
        });
        this.sim.getSimInfo().then((value: any) => {
            if (value.countryCode) {
                const simCountry = countries.find(cc => cc.code === value.countryCode.toUpperCase());
                if (simCountry) {
                    this.user.phoneCode = simCountry.dial_code;
                }
            }
        });
    }
}
