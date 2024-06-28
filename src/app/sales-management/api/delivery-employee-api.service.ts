import { environment } from "@environments/environment"
import { ApiService } from "./api.service"
import { Injectable } from "@angular/core"
import { Customer } from "@app/_components/category/customer/customer.model"
import { Result, ResultNoPaging } from "@app/_models/Result"
import { Observable } from "rxjs"
import { DeliveryEmployee } from "../model/common/delivery-employee.model"

const GET_MANY_URL = `${environment.apiUrl}/Category/find/dmnvvc`
const GET_ONE_URL = `${environment.apiUrl}/category/getbyid/dmkh`


@Injectable({
    providedIn: 'root'
})
export class DeliveryEmployeeApiService extends ApiService {

    getMany(body: {}): Observable<Result<DeliveryEmployee>> {
        return this.post<Result<DeliveryEmployee>>(GET_MANY_URL, body);
    }

    getOneById(ma_nvvc: string): Observable<ResultNoPaging<Customer>> {
        const body = {
            name: "ma_kh",
            operator: "=",
            value: ma_nvvc
        }
        return this.post<ResultNoPaging<Customer>>(GET_ONE_URL, body);
    }
}