import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { StorageProvider } from '../../providers/storage.provider';
import { AlertProvider } from '../../providers/alert.provider';
import { User } from '../../core/api/users/user';
import { PhotoUtils } from '../../utils/photo.utils';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.page.html',
    styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

    user: User = {};
    profileImage: string;

    constructor(private storageService: StorageProvider,
                public alert: AlertProvider,
                private router: Router) {
    }

    async ngOnInit() {
        this.user = await this.storageService.getPagamiUser();
        this.profileImage = PhotoUtils.getThumbnailPhoto(this.user);
    }

    async goToMyBusiness() {
        const user: User = await this.storageService.getPagamiUser();
        if (user.phone && user.location.address) {
            await this.router.navigateByUrl('/app/settings/my-business');
        } else {
            await this.alert.alertCompleteProfile();
        }
    }
}
