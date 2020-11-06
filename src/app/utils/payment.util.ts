import { PAYMENTS } from './Const';

export class PaymentUtil {

    static getTypeSpanish(type: string) {
        switch (type) {
            case 'cash':
                return 'Efectivo';
            case 'transfer':
                return 'Transferencia';
            case 'googlePay':
                return 'Google pagos';
            default:
                return type;
        }
    }

    static getStatusSpanish(status: string) {
        switch (status) {
            case PAYMENTS.STATUS.ACCEPTED:
                return 'Pago Aceptado';
            case PAYMENTS.STATUS.REJECTED:
                return 'Pago Rechazado';
            default:
                return 'Pago Pendiente';
        }
    }

    static getStatusColor(status: string) {
        switch (status) {
            case PAYMENTS.STATUS.ACCEPTED:
                return 'success';
            case PAYMENTS.STATUS.REJECTED:
                return 'danger';
            default:
                return 'warning';
        }
    }

}
