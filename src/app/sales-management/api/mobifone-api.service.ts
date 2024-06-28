import { ApiService } from "./api.service"
import { Injectable } from "@angular/core"
import { Result, ResultNoPaging } from "@app/_models/Result"
import { Observable, of } from "rxjs"
import { Mobifone } from "../model/common/mobifone.model"

const POST_MOBIFONE_URL = `chưa có`;
@Injectable({
  providedIn: 'root'
})
export class MobifoneApiService extends ApiService {

  postMobifone(body: Mobifone): Observable<any> {
    const url = POST_MOBIFONE_URL;
    // return this.post<Result<any>>(url, body);
    return of({
      code: "API000",
      message: "Success!"
    });
  }
}