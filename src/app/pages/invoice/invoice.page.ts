import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentsService } from '../../core/api/payments/payments.service';
import { ApiResponse } from '../../core/api/api.response';
import { ToastProvider } from '../../providers/toast.provider';
import { PaymentInvoice } from '../../core/api/payments/PaymentInvoice';
import { PAYMENTS } from '../../utils/Const';
import { PaymentUtil } from '../../utils/payment.util';

@Component({
    selector: 'app-invoice',
    templateUrl: './invoice.page.html',
    styleUrls: ['./invoice.page.scss'],
})
export class InvoicePage implements OnInit {

    invoice: PaymentInvoice = {};
    STATUS = PAYMENTS.STATUS;
    paymentUtil = PaymentUtil;
    loading = true;
    urlComeBack: string;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private paymentsService: PaymentsService,
                private toast: ToastProvider) {
    }

    ngOnInit() {
        const params = this.route.snapshot.params;
        this.getInvoice(params.id);
        const url = this.router.url.split('/');
        const root = url[1];
        if (root === 'admin') {
            this.urlComeBack = '/admin/tabs/activity';
        } else {
            this.urlComeBack = '/app/tabs/wallet/activity';
        }
    }

    private getInvoice(paymentId: string) {
        this.loading = true;
        this.paymentsService.getInvoice(paymentId)
            .then((success: ApiResponse) => {
                console.log('-> success', success);
                if (success.passed) {
                    this.invoice = success.response;
                } else {
                    this.toast.messageErrorAboveButton('No se ha podido extraer tu factura, intenta de nuevamente!');
                }
            }, e => this.toast.messageErrorAboveButton('Hemos tenido problemas obteniendo tu factura, comprueba tu conexión!'))
            .finally(() => this.loading = false);
    }
}
