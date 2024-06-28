import { environment } from '@environments/environment';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { Result, ResultNoPaging } from '@app/_models/Result';
import { Observable } from 'rxjs';
import { POSModel } from '../model/dto/pos.dto';

const GET_MANY_URL = `${environment.apiUrl}/Category/find/dmmaypos`;
const GET_ONE_URL = `${environment.apiUrl}/category/getbyid/dmmaypos`;

@Injectable({
    providedIn: 'root'
})
export class POSService extends ApiService {

    findById(body: any, page_index: number, page_size: number): Observable<Result<POSModel>> {
        return this.post<Result<POSModel>>(GET_MANY_URL, body, { page_index, page_size });
    }

    getOneById(ma_pos: string): Observable<ResultNoPaging<POSModel>> {
        const body = {
            name: 'ma_pos',
            operator: '=',
            value: ma_pos
        };
        return this.post<ResultNoPaging<POSModel>>(GET_ONE_URL, body);
    }


}