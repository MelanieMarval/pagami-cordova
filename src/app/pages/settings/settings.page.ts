import { Component, OnInit } from '@angular/core';
import { StorageProvider } from '../../providers/storage.provider';
import { User } from '../../core/api/users/user';
import { UserUtils } from '../../utils/user.utils';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.page.html',
    styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

    private user: User = {};
    private profileImage: string;

    constructor(private storageService: StorageProvider) {
    }

    async ngOnInit() {
      this.user = await this.storageService.getPagamiUser();
      this.profileImage = UserUtils.getThumbnailPhoto(this.user);
    }

}
