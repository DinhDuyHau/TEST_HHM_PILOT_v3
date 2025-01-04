import { environment } from "@environments/environment"
import { ApiService } from "./api.service"
import { Injectable } from "@angular/core"
import { Customer } from "@app/_components/category/customer/customer.model"
import { Result, ResultNoPaging } from "@app/_models/Result"
import { Observable } from "rxjs"
import { Merchandise } from "../model/ticket/retail/model"

const GET_MANY_URL = `${environment.apiUrl}/Category/find/dmvt`
const GET_ONE_URL = `${environment.apiUrl}/category/getbyid/dmvt`
const GET_MANY_TYPE_MERCHANDISE_URL = `${environment.apiUrl}/category/find/dmloaikho`
const GET_MANY_WAREHOUSE_URL = `${environment.apiUrl}/category/find/dmkho`
const GET_MANY_TYPE_MERCHANDISE_BY_STORE_URL = `${environment.apiUrl}/category/find/vdmkho`
const GET_GROUP_STOCK_URL = `${environment.apiUrl}/category/find/dmnhkho`

@Injectable({
    providedIn: 'root'
})
export class MerchandiseApiService extends ApiService {

    getMany(body: {}): Observable<Result<Merchandise>> {
        return this.post<Result<Merchandise>>(GET_MANY_URL, body);
    }

    getManyTypeMerchadise(body: {}): Observable<Result<any>> {
        return this.post<Result<any>>(GET_MANY_TYPE_MERCHANDISE_URL, body);
    }

    getManyTypeMerchadiseByStore(body: {}): Observable<Result<any>> {
        return this.post<Result<any>>(GET_MANY_TYPE_MERCHANDISE_BY_STORE_URL, body);
    }

    getGroupStock(body: {}): Observable<Result<any>> {
        return this.post<Result<any>>(GET_GROUP_STOCK_URL, body);
    }

    getOneById(ma_vt: string): Observable<ResultNoPaging<Merchandise>> {
        const body = {
            name: "ma_vt",
            operator: "=",
            value: ma_vt
        }
        return this.post<ResultNoPaging<Merchandise>>(GET_ONE_URL, body);
    }

    getManyWarehouse(body: {}): Observable<Result<Merchandise>> {
        return this.post<Result<Merchandise>>(GET_MANY_WAREHOUSE_URL, body);
    }
}
