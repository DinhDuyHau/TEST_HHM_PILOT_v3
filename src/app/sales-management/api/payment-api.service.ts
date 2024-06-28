import { environment } from "@environments/environment"
import { ApiService } from "./api.service"
import { Injectable } from "@angular/core"
import { Result, ResultNoPaging } from "@app/_models/Result"
import { Observable } from "rxjs"
import { BankAccount } from "../model/dto/bank-account-info.dto"

const GET_BANK_ACCOUNT_URL = `${environment.apiUrl}/Category/find/dmtknh`;
const GET_INSTALLMENT_UNIT_URL = `${environment.apiUrl}/Category/find/dmdvtragop`;
const GET_ALL_BANK_ACCOUNT_URL = `${environment.apiUrl}/category/listall/dmtknh`;

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

}