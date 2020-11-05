
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

}
