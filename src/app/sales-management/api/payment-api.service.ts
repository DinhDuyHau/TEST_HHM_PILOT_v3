import { environment } from "@environments/environment"
import { ApiService } from "./api.service"
import { Injectable } from "@angular/core"
import { Result, ResultNoPaging, ResultNoPagingCategory } from "@app/_models/Result"
import { Observable } from "rxjs"
import { BankAccount, BankPublishCard } from "../model/dto/bank-account-info.dto"

const GET_BANK_ACCOUNT_URL = `${environment.apiUrl}/Category/find/dmtknh`;
const GET_INSTALLMENT_UNIT_URL = `${environment.apiUrl}/Category/find/dmdvtragop`;
const GET_ALL_BANK_ACCOUNT_URL = `${environment.apiUrl}/category/listall/dmtknh`;
const GET_ALL_BANK_PUBLISH_CARD_URL = `${environment.apiUrl}/Category/find/dmnganhangpht`;
const SEND_OTP_URL = `${environment.apiUrl}/otp/sendOtp`;
const VERIFY_OTP_URL = `${environment.apiUrl}/otp/verify`;

@Injectable({
    providedIn: 'root'
})
export class PaymentApiService extends ApiService {

    findBankAccountById(tknh: string, page_index: number, page_size: number): Observable<Result<BankAccount>> {
        const body = [{
            "Name": "tknh",
            "Operator": "=",
            "Value": tknh
        }]
        return this.post<Result<BankAccount>>(GET_BANK_ACCOUNT_URL, body);
    }

    findInstallmentInitById(ma_dvtg: string, page_index: number, page_size: number): Observable<Result<BankAccount>> {
        const body = [{
            "Name": "tknh",
            "Operator": "=",
            "Value": ma_dvtg
        }]
        return this.post<Result<BankAccount>>(GET_INSTALLMENT_UNIT_URL, body);
    }

    getAllBankAccount(): Observable<ResultNoPaging<BankAccount>> {
        return this.get<ResultNoPaging<BankAccount>>(GET_ALL_BANK_ACCOUNT_URL);
    }

    findBankAccountByPaymentMethod(payment_method: string, filters: any[], page_index: number, page_size: number): Observable<Result<BankAccount>> {
        let body: any[] = [{
            name: 'ma_thanhtoan',
            operator: '=',
            value: payment_method
        }];
        body.push(...filters.filter(x => x.name !== 'tknh'));
        return this.post<Result<BankAccount>>(GET_BANK_ACCOUNT_URL, body);
    }

    findBankPublishCard(bank_code: string, filters: any[], page_index: number, page_size: number): Observable<Result<BankPublishCard>> {
        let body: any[] = [];
        if (bank_code && bank_code !== '') {
            body.push({
                name: 'ky_hieu',
                operator: '=',
                value: bank_code
            });
        }
        if (filters && filters.length > 0) body.push(...filters);
        return this.post<Result<BankPublishCard>>(GET_ALL_BANK_PUBLISH_CARD_URL, body);
    }

    sendOtp(ma_kh: string, ngay_ct: string, so_diem: number): Observable<ResultNoPaging<null>> {
        return this.get<ResultNoPaging<null>>(SEND_OTP_URL, { ma_kh, ngay_ct, so_diem });
    }

    verifyOtp(ma_kh: string, ma_otp: string): Observable<ResultNoPagingCategory<{ so_tien: number }>> {
        return this.get<ResultNoPagingCategory<{ so_tien: number }>>(VERIFY_OTP_URL, { ma_kh, ma_otp });
    }

}