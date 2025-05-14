import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from '@environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class PaymentDynamicService {
    constructor(private http: HttpClient) { }

    createQrCode(body: any, paymenyCode: string) {
        let url = `${environment.apiBankUrl}/v1/Payment/${paymenyCode}/createqr`;
        return this.http.post<any>(url, body);
    }

    getRefCode(paymenyCode: string) {
        let url = `${environment.apiBankUrl}/v1/Payment/${paymenyCode}/getRefCode`;
        return this.http.get<any>(url);
    }

    deleteQrCode(body: any, paymenyCode: string) {
        let url = `${environment.apiBankUrl}/v1/Payment/${paymenyCode}/deleteqr`;
        return this.http.delete<any>(url, { body: body });
    }
}
