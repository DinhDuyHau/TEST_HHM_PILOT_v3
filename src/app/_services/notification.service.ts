import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { catchError, map, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationService {
    constructor(private http: HttpClient) { }

    getQuantityNewNotificaiton() {
        return this.http.get<any>(`${environment.apiUrl}/notification/get_quantity_new_notification`);
    }
    getNotification(status: string, page_index: number, page_size: number) {
        return this.http.get<any>(`${environment.apiUrl}/notification/get_notification?status=${status}&page_index=${page_index}&page_size=${page_size}`);
    }
    updateStatusNewNotification() {
        return this.http.put<any>(`${environment.apiUrl}/notification/update_status_new_notification`, {});
    }
    updateStatusNotification(notification_id: number) {
        return this.http.put<any>(`${environment.apiUrl}/notification/update_status_notification?notification_id=${notification_id}`, {}).subscribe();
    }
    updateToken(token: string) {
        this.http.put<any>(`${environment.apiUrl}/notification/update_token?token=${token}`, {}).subscribe();
    }
    deleteToken() {
        return this.http.delete<any>(`${environment.apiUrl}/notification/delete_token`).pipe(
            catchError((error: any) => {
                // xử lý lỗi ở đây
                return of({ success: false, message: error });
            }),
            map((res) => {
                return res;
            }));
    }
}