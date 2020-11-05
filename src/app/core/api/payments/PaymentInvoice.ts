export interface PaymentInvoice {
    amount?: number;
    currency?: string;
    date?: string;
    planDays?: number;
    planName?: string;
    planProducts?: number;
    planServices?: number;
    status?: string;
    transactionId?: string;
    type?: string;
    userLastname?: string;
    userName?: string;
}
