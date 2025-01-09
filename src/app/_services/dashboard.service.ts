import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { DashboardSales, DashboardSalesCommission, DashboardSalesStats, DashboardTopSelling, Result } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private http: HttpClient) { }

  getDashboardTopSelling(): Observable<Result<DashboardTopSelling>> {
    const body = {};
    return this.http.post<Result<DashboardTopSelling>>(`${environment.apiUrl}/report/rptDashboardTopSelling`, body).pipe(
      catchError(error => {
        console.error('Error fetching DashboardTopSelling data', error);
        // Trả về một kết quả rỗng phù hợp với kiểu `Result<DashboardTopSelling>`
        return of({
          success: false,
          message: 'Error fetching data',
          result: {
            pageIndex: 0,
            pageCount: 0,
            pageSize: 0,
            recordCount: 0,
            items: []
          }
        });
      })
    );
  }

  getDashboardSales(): Observable<Result<DashboardSales>> {
    const body = {};
    return this.http.post<Result<DashboardSales>>(`${environment.apiUrl}/report/rptDashboardSales`, body).pipe(
      catchError(error => {
        console.error('Error fetching DashboardSales data', error);
        // Trả về một kết quả rỗng phù hợp với kiểu `Result<DashboardSales>`
        return of({
          success: false,
          message: 'Error fetching data',
          result: {
            pageIndex: 0,
            pageCount: 0,
            pageSize: 0,
            recordCount: 0,
            items: []
          }
        });
      })
    );
  }

  getDashboardSalesCommission(): Observable<Result<DashboardSalesCommission>> {
    const body = {};
    return this.http.post<Result<DashboardSalesCommission>>(`${environment.apiUrl}/report/rptDashboardSalesCommission`, body).pipe(
      catchError(error => {
        console.error('Error fetching DashboardSalesCommission data', error);
        return of({
          success: false,
          message: 'Error fetching data',
          result: {
            pageIndex: 0,
            pageCount: 0,
            pageSize: 0,
            recordCount: 0,
            items: []
          }
        });
      })
    );
  }

  getDashboardSalesStats(): Observable<Result<DashboardSalesStats>> {
    const body = {};
    return this.http.post<Result<DashboardSalesStats>>(`${environment.apiUrl}/report/rptDashboardSalesStats`, body).pipe(
      catchError(error => {
        console.error('Error fetching DashboardSalesStats data', error);
        return of({
          success: false,
          message: 'Error fetching data',
          result: {
            pageIndex: 0,
            pageCount: 0,
            pageSize: 0,
            recordCount: 0,
            items: []
          }
        });
      })
    );
  }
}
