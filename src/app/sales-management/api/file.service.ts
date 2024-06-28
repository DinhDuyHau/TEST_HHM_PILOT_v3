import { environment } from "@environments/environment"
import { ApiService } from "./api.service"
import { Injectable } from "@angular/core"
import { Observable } from "rxjs"
import { ResultDetailVoucher, ResultNoPaging } from "@app/_models/Result";

const UPLOAD_FILE_WHOLE_CONTRACT = `${environment.apiUrl}/upload/save_wholesale_contract`;
const DELETE_FILE_WHOLE_CONTRACT = `${environment.apiUrl}/upload/delete_wholesale_contract`;

@Injectable({
  providedIn: 'root'
})
export class UploadFileApiService extends ApiService {

  uploadFileContract(formData: FormData): Observable<ResultDetailVoucher<any>> {
    return this.post<any>(UPLOAD_FILE_WHOLE_CONTRACT, formData);
  }

  deleteWholeContract(so_ct: string, ngay_ct: string): Observable<ResultDetailVoucher<any>> {
    const url = DELETE_FILE_WHOLE_CONTRACT;
    return this.delete<ResultDetailVoucher<any>>(url, {}, { so_ct, ngay_ct });
  }
}