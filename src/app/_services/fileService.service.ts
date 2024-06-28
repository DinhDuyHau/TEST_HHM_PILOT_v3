import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { catchError, map, of } from 'rxjs';
import { getResource } from '@app/_common/commonFunction';

@Injectable({ providedIn: 'root' })
export class FileService {
    constructor(private http: HttpClient) { }

    getFileFromUrl(path: string) {
        return this.http.get(`${environment.apiUrl}/upload/getFile?fileName=${path}`, { responseType: 'blob' });
    }

    upLoadEventGiftImage(so_ct: string, ngay_ct: string, file: any) {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('so_ct', so_ct);
        formData.append('ngay_ct', ngay_ct);
        return this.http.post<any>(`${environment.apiUrl}/upload/save_event_gift`, formData).pipe(
            catchError((error: any) => {
                return of({ success: false, message: error });
            }),
            map((res) => {
                return res;
            }));
    }
}