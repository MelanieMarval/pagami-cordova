import { Component, OnInit } from '@angular/core';
import { AlertProvider } from '../../../providers/alert.provider';
import { NotificationsProvider } from '../../../providers/notifications.provider';

@Component({
    selector: 'app-wallet',
    templateUrl: 'wallet.html',
    styleUrls: ['wallet.scss']
})
export class WalletPage implements OnInit {

    empty: boolean;
    hasNotification = false;

    constructor(public alert: AlertProvider,
                private notificationsProvider: NotificationsProvider) {
    }

    ngOnInit(): void {
        this.empty = true;
        console.log('-> this.notificationsProvider.hasWalletNotification', this.notificationsProvider.hasWalletNotification);
        this.hasNotification = this.notificationsProvider.hasWalletNotification > 0;
        this.notificationsProvider.walletNotification.subscribe(next => {
            this.hasNotification = next;
        });
    }

}
