import { Component, OnInit } from '@angular/core';
import { ResolveEnd, Router } from '@angular/router';
import { PlacesService } from '../../../core/api/places/places.service';
import { ApiResponse } from '../../../core/api/api.response';
import { Place } from '../../../core/api/places/place';
// Providers
import { ToastProvider } from '../../../providers/toast.provider';
import { StorageProvider } from '../../../providers/storage.provider';
import { UserIntentProvider } from '../../../providers/user-intent.provider';
// Utils
import { PLACES } from '../../../utils/Const';
import { PlaceUtils } from '../../../utils/place.utils';
import { User } from '../../../core/api/users/user';
import { AlertProvider } from '../../../providers/alert.provider';
import { NotificationsProvider } from '../../../providers/notifications.provider';
import { NotificationType } from '../../../domain/enums/notification-type.enum';

@Component({
    selector: 'app-activity',
    templateUrl: 'activity.html',
    styleUrls: ['../wallet/wallet.scss']
})
export class ActivityPage implements OnInit {

    loading = true;
    error = false;
    hasNotification = 0;
    notifications: any[];
    registers: Place[] | any = [];
    user: User;
    STATUS = PLACES.STATUS;
    indexOfPlaceToEdit: number;
    placeUtils = PlaceUtils;
    reloading: boolean;
    targetRefresh;
    notificationType = NotificationType;

    constructor(private placesService: PlacesService,
                private storageService: StorageProvider,
                private router: Router,
                private toast: ToastProvider,
                private alert: AlertProvider,
                private notificationsProvider: NotificationsProvider,
                private storageInstance: UserIntentProvider) {
    }

    async ngOnInit() {
        this.router.events.subscribe(next => {
            if (next instanceof ResolveEnd) {
                this.verifyItemUpdated();
            }
        });
        this.getRegisters();
        this.user = await this.storageService.getPagamiUser();
        this.notifications = this.notificationsProvider.activityNotifications;
        console.log('-> this.notifications', this.notifications);
        this.hasNotification = this.notificationsProvider.hasWalletNotification;
        if (this.hasNotification) {
            this.notificationsProvider.setNotificationState(0);
        }
    }

    getRegisters() {
        this.loading = true;
        this.placesService.myRegisters()
            .then((success: ApiResponse) => {
                if (success.passed) {
                    this.registers = success.response;
                    this.loading = false;
                    this.error = false;
                } else {
                    this.loading = false;
                    this.error = true;
                    this.toast.messageErrorWithoutTabs('Hemos tenido problemas cargando la informacion');
                }
                if (this.targetRefresh) {
                    this.targetRefresh.complete();
                }
            }).catch(error => {
            this.loading = false;
            this.error = true;
            this.toast.messageErrorWithoutTabs('Hemos tenido problemas cargando la informacion');
            if (this.targetRefresh) {
                this.targetRefresh.complete();
            }
        });
    }

    verifyItemUpdated() {
        if (this.storageInstance.placeEdited) {
            if (!this.registers.filter(place => place.id === this.storageInstance.placeEdited.id).length) {
                this.getRegisters();
            } else {
                if (Number(this.indexOfPlaceToEdit)) {
                    this.registers[this.indexOfPlaceToEdit] = this.storageInstance.placeEdited;
                    this.indexOfPlaceToEdit = undefined;
                }
            }
            this.storageInstance.placeEdited = undefined;
        }
    }

    showDetails(place: Place) {
        if (place.status === this.STATUS.INCOMPLETE || place.status === this.STATUS.WAITING) {
            this.indexOfPlaceToEdit = this.registers.indexOf(place);
            this.storageInstance.placeToEdit = Object.assign({}, place);
            this.router.navigate(['/app/business-payment-details']);
            return;
        }
        if (place.status === this.STATUS.ACCEPTED || place.status === this.STATUS.VERIFIED) {
            if (place.claim && place.claim.userId === this.user.id) {
                this.router.navigate(['/app/tabs/my-business']);
            } else {
                this.storageInstance.placeToShow = place;
                this.router.navigate(['/app/shop']);
            }
        }
    }

    confirmDelete(register: Place) {
        this.alert.alertConfirmDelete()
            .then(() => {
                this.reloading = true;
                this.deleteRegister(register);
            });
    }

    deleteRegister(place: Place) {
        this.placesService.delete(place.id)
            .then(success => {
                if (success.passed) {
                    this.registers.splice(this.registers.indexOf(place), 1);
                    this.reloading = false;
                }
            });
    }

    onRefreshToBeVerified(event) {
        this.targetRefresh = event.target;
        this.getRegisters();
    }

    notificationIsAccepted(type: string): boolean {
        return type.includes('ACCEPTED');
    }

    showNotification(notification: any) {
        if (notification.type.includes(NotificationType.PAYMENT)) {
            this.router.navigate(['/app/invoice', notification.paymentId])
        } else {
            notification.showMessage = !notification.showMessage
        }
    }
}
