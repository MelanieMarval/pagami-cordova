import { Component, OnInit } from '@angular/core';
import { MapProvider } from '../../providers/map.provider';
import { NavigationEnd, Router } from '@angular/router';
import { NotificationsProvider } from '../../providers/notifications.provider';
import { DrawerState } from '../../shared/ion-bottom-drawer/drawer-state';

@Component({
    selector: 'app-tabs-page',
    templateUrl: 'tabs-page.html',
    styleUrls: ['tabs-page.scss']
})
export class TabsPage implements OnInit {

    currentUrl = '';
    notifications = 0;

    constructor(private appService: MapProvider,
                private notificationsProvider: NotificationsProvider,
                private router: Router) {
        router.events.subscribe((value: any) => {
            if (value instanceof NavigationEnd) {
                this.currentUrl = value.url;
                this.currentUrl = value.url.substring(value.url.lastIndexOf('/') + 1);
            }
        });
    }

    ngOnInit(): void {
        this.notifications = this.notificationsProvider.hasWalletNotification;
        this.notificationsProvider.walletNotification.subscribe(next => {
            this.notifications = next;
        });
        this.notificationsProvider.getNotifications();
    }

    openNearby() {
        this.appService.showNearby.emit();
    }

    openNearbySearch() {
        this.router.navigateByUrl('/app/tabs/map/searching');
        this.appService.showNearby.emit();
        this.appService.changeDrawerState.emit(DrawerState.Top);
    }

    openRegister() {
        this.appService.showRegister.emit();
    }
}
