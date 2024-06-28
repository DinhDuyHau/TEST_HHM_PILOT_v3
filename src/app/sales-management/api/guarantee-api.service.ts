import { environment } from "@environments/environment"
import { ApiService } from "./api.service"
import { Injectable } from "@angular/core"
import { Result, ResultNoPaging } from "@app/_models/Result"
import { Observable } from "rxjs"
import { Guarantee } from "../model/ticket/common-model/guarantee.model"

const GET_SERVICE_CENTERS = `${environment.apiUrl}/voucher/get_service_centers/`

@Injectable({
  providedIn: 'root'
})
export class GuaranteeApiService extends ApiService {
  getOneById(entity: string, params: {}): Observable<ResultNoPaging<Guarantee>> {
    const url = GET_SERVICE_CENTERS + entity;
    return this.get<ResultNoPaging<Guarantee>>(url, params);
  }
}