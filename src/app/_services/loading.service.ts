import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SidebarService } from '@app/_components/_shared/sidebar/sidebar.service';
import { Customer } from '@app/_components/category/customer/customer.model';
import { ItemFilter, ItemSort, Result } from '@app/_components/grid/grid.model';
import { MenuItem } from '@app/_components/_shared/sidebar/header.model';
import { Resource, Shop, Stock, User } from '@app/_models';
import { ResultNoPaging } from '@app/_models/Result';
import { environment } from '@environments/environment';
import { BehaviorSubject, Observable, forkJoin } from 'rxjs';
import { first, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private userSubject: BehaviorSubject<any | null>;
  public user: Observable<any | null>;
  constructor(private http: HttpClient, private sidebarService: SidebarService) {
    this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('customer')!));
    this.user = this.userSubject.asObservable();
  }

  getStockOfShop() {
    const user = JSON.parse(localStorage.getItem('user') + '');
    const apiUri = `${environment.apiUrl}/users/user-right-units`;
    const params = new HttpParams()
      .set('userName', user.shop);
    return this.http.get<Stock[]>(apiUri, { params });
  }
  getShop(): Observable<Shop[]> {
    const apiUri = `${environment.apiUrl}/category/listall/dmcuahang`;
    return this.http.get<ResultNoPaging<Shop>>(apiUri).pipe(map(res => {
      localStorage.setItem('shop', JSON.stringify(res.result));
      return res.result;
    }));
  }
  getStock(): Observable<Stock[]> {
    const apiUri = `${environment.apiUrl}/category/listall/dmkho`;
    return this.http.get<ResultNoPaging<Shop>>(apiUri).pipe(map(res => {
      localStorage.setItem('stock', JSON.stringify(res.result));
      return res.result;
    }));
  }
  getMenu(): Observable<MenuItem[]> {
    const apiUri = `${environment.apiUrl}/menuright/get_menu_rights`;
    return this.http.get<ResultNoPaging<MenuItem>>(apiUri).pipe(map(res => {
      const newMenu = res.result;
      localStorage.setItem('menu', JSON.stringify(newMenu));
      this.sidebarService.updateMenu(newMenu);
      return res.result;
    }));
  }
  getMenu_old(): Observable<Stock[]> {
    const apiUri = `${environment.apiUrl}/category/listall/menu_api`;
    return this.http.get<ResultNoPaging<Shop>>(apiUri).pipe(map(res => {
      localStorage.setItem('menu', JSON.stringify(res.result));
      return res.result;
    }));
  }
  getResource(): Observable<Resource[]> {
    const apiUri = `${environment.apiUrl}/category/listall/resources`;
    return this.http.get<ResultNoPaging<Resource>>(apiUri).pipe(map(res => {
      localStorage.setItem('resources', JSON.stringify(res.result));
      return res.result;
    }));
  }

  getItems(test: string): Observable<Result<Customer>> {
    return this.http.post<Result<Customer>>(environment.apiUrl +
      `/Category/find/dmkh?order_by=${'ma_kh desc'}&page_index=${10}&page_size=${24000}`, [{ name: 'ten_kh', operator: 'like', value: `%${test}%` }]
    )
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('customer', JSON.stringify(user));
        this.userSubject.next(user);
        return user;
      }));
  }
  getMenuReport(): Observable<any> {
    const apiUri = `${environment.apiUrl}/report/get_menu_report`;
    return this.http.get<ResultNoPaging<any>>(apiUri).pipe(map(res => {
      localStorage.setItem('menu_report', JSON.stringify(res.result));
      return res.result;
    }));
  }
  getVoucherInfo(): Observable<any> {
    const apiUri = `${environment.apiUrl}/category/listall/dmct`;
    return this.http.get<ResultNoPaging<any>>(apiUri).pipe(map(res => {
      localStorage.setItem('dmct', JSON.stringify(res.result));
      return res.result;
    }));
  }

  Loading() {
    return forkJoin([this.getStock(), this.getShop(), this.getMenu(), this.getResource(), this.getMenuReport(), this.getVoucherInfo()]);
  }
}
