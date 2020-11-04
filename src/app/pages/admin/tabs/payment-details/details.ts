import { Component, OnInit } from '@angular/core';
import { Payment } from '../../../../core/api/payments/Payment';
import { PlacesService } from '../../../../core/api/places/places.service';
import { PaymentsService } from '../../../../core/api/payments/payments.service';
import { AlertController } from '@ionic/angular';
import { AdminIntentProvider } from '../../../../providers/admin-intent.provider';
import { PlansService } from '../../../../core/api/plans/plans.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Place } from '../../../../core/api/places/place';
import { PlaceUtils } from '../../../../utils/place.utils';
import { PaymentToShow } from '../../../../core/api/payments/PaymentToShow';
import { BrowserProvider } from '../../../../providers/browser.provider';
import { PAYMENTS } from '../../../../utils/Const';
import { ToastProvider } from '../../../../providers/toast.provider';
import { ApiResponse } from '../../../../core/api/api.response';

@Component({
    selector: 'app-details',
    templateUrl: './details.html',
    styleUrls: ['./details.scss'],
})
export class DetailsPage implements OnInit {

    saving = false;
    saved = false;
    payment: PaymentToShow = {};
    loading: boolean;
    updating: boolean;
    STATUS = PAYMENTS.STATUS;
    placeTypeSpanish = PlaceUtils.getTypeSpanish;

    constructor(private placesService: PlacesService,
                private plansService: PlansService,
                private paymentsService: PaymentsService,
                private router: Router,
                private route: ActivatedRoute,
                private toast: ToastProvider,
                private alert: AlertController,
                private intentProvider: AdminIntentProvider,
                public browserProvider: BrowserProvider) {
    }

    ngOnInit() {
        const params = this.route.snapshot.params;
        if (params.id === 'details') {
            this.payment = this.intentProvider.paymentToView;
            this.getPaymentById(this.payment.id);
        } else {
            this.getPaymentById(params.id);
        }
        console.log('-> this.payment', this.payment);
    }

    getPaymentById(id: string) {
        this.loading = true;
        this.paymentsService.findById(id)
            .then((success: ApiResponse) => {
                console.log('-> success', success.response);
                if (success.passed) {
                    this.payment = success.response;
                } else {
                    this.toast.messageErrorWithoutTabs('No se ha podido obtener la informacion a mostrar. Intente de nuevo!');
                }
            }, error => {
                this.toast.messageErrorWithoutTabs('No se ha podido obtener la informacion a mostrar. Compruebe su conexion!');
            }).finally(() => this.loading = false);
    }

    async openConfirm() {
        const alert = await this.alert.create({
            header: 'Rechazar pago de plan',
            message: 'Este pago quedará como inválido, está seguro de no haberlo recibido?',
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        console.log('Confirm Cancel');
                    },
                }, {
                    text: 'Sí, seguro',
                    handler: () => {
                        this.changePaymentStatus(this.STATUS.REJECTED);
                    },
                },
            ],
        });
        await alert.present();
    }

    changePaymentStatus(status: string) {
        this.updating = true;
        this.paymentsService.changeStatus(this.payment.id, status)
            .then(success => {
                console.log('-> success', success);
                if (success.passed) {
                    this.updating = false;
                    this.intentProvider.paymentChanged = this.payment;
                    this.toast.messageSuccessWithoutTabs(`El pago ha sido *${status === this.STATUS.REJECTED ? 'Rechazado' : 'Aceptado'}* satisfactoriamente`);
                    this.router.navigate(['/admin/tabs/payments']);
                } else {
                    this.updating = false;
                    this.toast.messageErrorWithoutTabs('No se ha podido obtener la informacion a mostrar. Intente de nuevo!');
                }
            }, error => {
                this.updating = false;
                this.toast.messageErrorWithoutTabs('No se ha podido actualizar. Intente de nuevo!');
            });
    }
}
