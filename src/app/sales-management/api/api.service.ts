import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ItemFilter } from "@app/_components/grid/grid.model";
import { Observable, catchError, of } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    constructor(private http: HttpClient) { }

    get<T>(url: string, params?: any): Observable<T> {
        return this.http.get<T>(url, { params }).pipe(catchError(error => of(error)));
    }

    post<T>(url: string, body: any, param?: any): Observable<T> {
        return this.http.post<T>(url, body, { params: param }).pipe(catchError(error => of(error)));
    }

    postWithHeader<T>(url: string, body: any, param?: any, headers?: any): Observable<T> {
        return this.http.post<T>(url, body, { params: param, headers: headers }).pipe(catchError(error => of(error)));
    }

    put<T>(url: string, body: any, param?: any): Observable<T> {
        return this.http.put<T>(url, body, { params: param }).pipe(catchError(error => of(error)));
    }

    delete<T>(url: string, body?: any, params?: any): Observable<T> {
        return this.http.delete<T>(url, { params, body }).pipe(catchError(error => of(error)));
    }
}
