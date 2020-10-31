import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Sim } from '@ionic-native/sim/ngx';
import { User } from '../../core/api/users/user';
// Provider
import { StorageProvider } from '../../providers/storage.provider';
import { ToastProvider } from '../../providers/toast.provider';
// Services
import { PlacesService } from '../../core/api/places/places.service';
import { VerifyAndroidPermissionsService } from '../../core/permissions/verify-android-permissions.service';
import { AuthService } from '../../core/api/auth/auth.service';

@Component({
    selector: 'app-terms',
    templateUrl: 'terms.html',
    styleUrls: ['terms.scss'],
})
export class TermsPage implements OnInit {

    user: User;
    termsAccepted = false;
    saving = false;

    constructor(private storageService: StorageProvider,
                private route: Router,
                private toast: ToastProvider,
                private sim: Sim,
                private placesService: PlacesService,
                private authService: AuthService,
                private verifyAndroidPermissions: VerifyAndroidPermissionsService) {
    }

    async ngOnInit() {
        this.user = await this.storageService.getUserUnregistered();
        console.log('-> user', this.user);
        this.setLocation();
    }

    private setLocation() {
        this.placesService.getAllCountries().then(async value => {
            const countries = value;

            const simInfo = await this.sim.getSimInfo();
            if (simInfo.countryCode) {
                const simCountry = countries.find(cc => cc.code === simInfo.countryCode.toUpperCase());
                if (simCountry) {
                    this.user.phoneCode = simCountry.dial_code;
                    this.user.location = {
                        country: simCountry.name,
                        code: simCountry.code
                    };
                }
            }
        }, e => {
            console.log('-> e', e);
            this.toast.messageErrorWithoutTabs('Intente nuevamente o comuniquese con nosotros!', 2500, 'Etamos presentando inconvenientes');
        });
    }

    continueRegister() {
        this.user.terms = true;
        this.saving = true;
        this.addUser();
    }

    addUser() {
        const self = this;
        this.authService.create(this.user)
            .then(async response => {
                if (response.passed === true) {
                    await this.storageService.setPagamiUser(response.response);
                    await this.storageService.setLogged(true);
                    await this.toast.messageSuccessWithoutTabs('BIENVENIDO A PAGAMI!', 2500);
                    await this.route.navigate(['/app/tabs/map/search']);
                    await this.verifyAndroidPermissions.checkPermissions();
                } else {
                    this.toast.messageErrorWithoutTabs('Hemos tenido problemas creando su usuario. Intente nuevamente!', 2500);
                }
            }).finally(() => {
            self.saving = false;
        });
    }

}
