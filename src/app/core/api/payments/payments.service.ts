import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../api.service';
import { ApiResponse } from '../api.response';
import { PAYMENTS } from '../../../utils/Const';
import { Payment } from './Payment';

@Injectable({
    providedIn: 'root'
})
export class PaymentsService {

    private URL = `${environment.API_URL}/payments`;
    private httpClient: HttpClient;

    constructor(private apiService: ApiService) {
        this.httpClient = apiService.httpClient;
    }

    /**
     *
     * @param payment: payment object to make request
     */
    async save(payment: Payment): Promise<ApiResponse> {
        const options: any = await this.apiService.getOptionsHeadersTokenized();
        const request = this.httpClient.post(`${this.URL}`, payment, options);
        return this.apiService.serverListener(request);
    }

    /**
     *
     * @param paymentId: id of the claim request
     * @param status: new status, can be PAYMENT.STATUS.REJECTED or PAYMENT.STATUS.ACCEPTED, remember use 'Const'
     */
    async changeStatus(paymentId: string, status: string): Promise<ApiResponse> {
        const options: any = await this.apiService.getOptionsHeadersTokenized();
        const request = this.httpClient.put(`${this.URL}/${paymentId}/status/${status}`, {}, options);
        return this.apiService.serverListener(request);
    }

    async getPendingById(placeId: string): Promise<ApiResponse> {
        const options: any = await this.apiService.getOptionsHeadersTokenized();
        const request = this.httpClient.get(`${this.URL}/${PAYMENTS.STATUS.PENDING}/place/${placeId}`, options);
        return this.apiService.serverListener(request);
    }

    /**
     * Get all payments accepted and rejected
     */
    async getAllFinish(): Promise<ApiResponse> {
        const options: any = await this.apiService.getOptionsHeadersTokenized();
        const request = this.httpClient.get(`${this.URL}/all-finish`, options);
        return this.apiService.serverListener(request);
    }

    /**
     * Get all payments accepted
     */
    async getAccepted(): Promise<ApiResponse> {
        const options: any = await this.apiService.getOptionsHeadersTokenized();
        const request = this.httpClient.get(`${this.URL}/status/${PAYMENTS.STATUS.ACCEPTED}`, options);
        return this.apiService.serverListener(request);
    }

    /**
     * Get payments pending to verify
     */
    async getPending(): Promise<ApiResponse> {
        const options: any = await this.apiService.getOptionsHeadersTokenized();
        const request = this.httpClient.get(`${this.URL}/status/${PAYMENTS.STATUS.PENDING}`, options);
        return this.apiService.serverListener(request);
    }

    /**
     * Get a payment with plan, place and user
     * @param id
     * string id generate by firebase
     */
    async findById(id: string): Promise<ApiResponse> {
        const options: any = await this.apiService.getOptionsHeadersTokenized();
        const request = this.httpClient.get(`${this.URL}/${id}`, options);
        return this.apiService.serverListener(request);
    }

    /**
     * Get details for create a payments's invoice
     * @param id
     * string id of payment
     */
    async getInvoice(id: string): Promise<ApiResponse> {
        const options: any = await this.apiService.getOptionsHeadersTokenized();
        const request = this.httpClient.get(`${this.URL}/invoice/${id}`, options);
        return this.apiService.serverListener(request);
    }

    /**
     * Get payments by user
     * @param userId
     * string id of user
     */
    async getPaymentsByUser(userId: string): Promise<ApiResponse> {
        const options: any = await this.apiService.getOptionsHeadersTokenized();
        const request = this.httpClient.get(`${this.URL}/user/${userId}`, options);
        return this.apiService.serverListener(request);
    }
}
