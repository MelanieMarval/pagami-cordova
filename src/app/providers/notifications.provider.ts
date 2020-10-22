import { EventEmitter, Injectable, OnInit } from '@angular/core';
import { NotificationsService } from '../core/api/notifications/notifications.service';
import { ApiResponse } from '../core/api/api.response';

@Injectable({
    providedIn: 'root'
})
export class NotificationsProvider {

    walletNotification: EventEmitter<number> = new EventEmitter<number>();
    hasWalletNotification = 0;
    activityNotifications: any[] = [];

    constructor(private notificationsService: NotificationsService) {
    }

    getNotifications() {

        setTimeout(() => {
            this.notificationsService.getNotifications()
                .then((success: ApiResponse) => {
                    if (success.passed) {
                        const notifications: [] = success.response;
                        this.activityNotifications = notifications;
                        this.setNotificationState(notifications.length);
                    }
                }).catch(error => console.log(error));
        }, 5000);
    }

    setNotificationState(state: number) {
        if (!state && this.hasWalletNotification) {
            this.notificationsService.putReadAllAcceptedAndRejected();
        }
        this.hasWalletNotification = state;
        this.walletNotification.emit(this.hasWalletNotification);
    }
}
