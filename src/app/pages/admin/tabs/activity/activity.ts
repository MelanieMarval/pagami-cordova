import { Component, OnInit } from '@angular/core';
import { ResolveEnd, Router } from '@angular/router';
import { PlacesService } from '../../../../core/api/places/places.service';

// Providers
import { ToastProvider } from '../../../../providers/toast.provider';
// Utils
import { PAYMENTS, PLACES } from '../../../../utils/Const';
import { PlaceUtils } from '../../../../utils/place.utils';
import { Place } from '../../../../core/api/places/place';
import { AdminIntentProvider } from '../../../../providers/admin-intent.provider';
import { PaymentsService } from '../../../../core/api/payments/payments.service';
import { ApiResponse } from '../../../../core/api/api.response';
import { Payment } from '../../../../core/api/payments/Payment';
import { PhotoUtils } from '../../../../utils/photo.utils';

@Component({
    selector: 'app-admin-activity',
    templateUrl: 'activity.html',
    styleUrls: ['activity.scss'],
})
export class ActivityPage implements OnInit {

    loading = true;
    error = false;
    empty = false;
    payments: any[] = [];
    STATUS = PAYMENTS.STATUS;
    indexOfPlaceToEdit: number = undefined;
    thumbnailPayment = PhotoUtils.getThumbnailPayment;
    response: any = {};

    constructor(private paymentsService: PaymentsService,
                private router: Router,
                private toast: ToastProvider) {
    }

    ngOnInit() {
        this.router.events.subscribe(next => {
            if (next instanceof ResolveEnd) {
                this.verifyItemUpdated();
            }
        });
        this.getPayments();
    }

    getPayments() {
        this.loading = true;
        this.paymentsService.getAllFinish().then(async (success: ApiResponse) => {
            this.loading = false;
            console.log('-> success', success);
            if (success.passed) {
                this.payments = success.response.payments;
                this.response = success.response;
                this.error = false;
                this.empty = this.payments.length === 0;
            } else {
                this.error = true;
                this.toast.messageErrorWithoutTabs('La informacion no se ha podido cargar. Intente de nuevo!', 5000);
            }
        });
    }

    verifyItemUpdated() {
        // if (this.intentProvider.placeEdited && Number(this.indexOfPlaceToEdit)) {
        //     this.payments[this.indexOfPlaceToEdit] = this.intentProvider.placeEdited;
        //     this.intentProvider.placeEdited = undefined;
        //     this.indexOfPlaceToEdit = undefined;
        // }
    }

    showDetails(payment: Payment) {
        this.router.navigate(['/admin/tabs/activity', payment.id]);
        // if (place.status === this.STATUS.INCOMPLETE || place.status === this.STATUS.WAITING) {
        //     // this.indexOfPlaceToEdit = this.payments.indexOf(place);
        //     this.intentProvider.placeToEdit = Object.assign({}, place);
        //     this.router.navigate(['/app/business-payment-details']).then();
        //     return;
        // }
        // if (place.status === this.STATUS.ACCEPTED || place.status === this.STATUS.VERIFIED) {
        //     this.intentProvider.placeToView = place;
        //     this.router.navigate(['/app/shop']).then();
        // }
    }

    goToProfile() {
        this.router.navigate(['/admin/profile']);
    }

    paymentTypeToSpanish(status: string) {
        let newStatus = 'Efectivo';
        if (status === 'transfer') {
            newStatus = 'Transferencia';
        }
        return newStatus;
    }
}
