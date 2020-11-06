import { Component, OnInit } from '@angular/core';
import { AlertProvider } from '../../../providers/alert.provider';
import { NotificationsProvider } from '../../../providers/notifications.provider';
import { PaymentsService } from '../../../core/api/payments/payments.service';
import { User } from '../../../core/api/users/user';
import { StorageProvider } from '../../../providers/storage.provider';
import { ApiResponse } from '../../../core/api/api.response';
import { ToastProvider } from '../../../providers/toast.provider';
import { PaymentUtil } from '../../../utils/payment.util';
import { PAYMENTS } from '../../../utils/Const';
import { PaymentItemList } from '../../../core/api/payments/PaymentItemList';
import { Router } from '@angular/router';

@Component({
    selector: 'app-wallet',
    templateUrl: 'wallet.html',
    styleUrls: ['wallet.scss'],
})
export class WalletPage implements OnInit {

    empty: boolean;
    hasNotification = false;
    loading = true;
    payments: PaymentItemList[] = [];
    paymentUtil = PaymentUtil;
    STATUS = PAYMENTS.STATUS;

    constructor(public alert: AlertProvider,
                private notificationsProvider: NotificationsProvider,
                private paymentService: PaymentsService,
                private router: Router,
                private toast: ToastProvider,
                private storage: StorageProvider) {
    }

    ngOnInit(): void {
        this.empty = true;
        this.checkNotifications();
        this.getPayments();
    }

    private checkNotifications() {
        console.log('-> this.notificationsProvider.hasWalletNotification', this.notificationsProvider.hasWalletNotification);
        this.hasNotification = this.notificationsProvider.hasWalletNotification > 0;
        this.notificationsProvider.walletNotification.subscribe(next => {
            console.log('-> next', next);
            this.hasNotification = next;
        });
    }

    private async getPayments() {
        this.loading = true;
        const user: User = await this.storage.getPagamiUser();
        this.paymentService.getPaymentsByUser(user.id)
            .then((success: ApiResponse) => {
                console.log('-> success', success);
                if (success.passed) {
                    this.payments = success.response;
                } else {
                    this.toast.messageErrorAboveButton('Hemos teneido problemas cargando la informacion, intenta de nuevo!');
                }
            }, e => {
                this.toast.messageErrorAboveButton('Hemos teneido problemas cargando la informacion, compruebe su conexion!');
            }).finally(() => this.loading = false);
    }

    viewInvoice(id: string) {
        this.router.navigate(['/app/invoice', id]);
    }
}
