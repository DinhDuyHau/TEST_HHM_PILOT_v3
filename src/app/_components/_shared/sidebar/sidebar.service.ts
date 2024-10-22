import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { MenuItem, MenuItemApi } from './header.model';
import { getMenuFromLocalStorage2 } from '@app/_common/commonFunction';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private menuSubject: BehaviorSubject<MenuItem[] | null>;
  public menu: Observable<MenuItem[] | null>;

  constructor(private http: HttpClient) {
    this.menuSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('menu')!));
    this.menu = this.menuSubject.asObservable();
  }

  getMenu(): Observable<MenuItemApi> {
    return this.http.get<MenuItemApi>(environment.apiUrl + '/Category/listall/menu_api').pipe();
  }
  getMenuFromLocalStorage() {
    return this.menuSubject.value || [];
  }

  getMenuFromLocalStorage2(): Observable<any> {
    return getMenuFromLocalStorage2();
  }

  updateMenu(newMenu: MenuItem[]): void {
    localStorage.setItem('menu', JSON.stringify(newMenu));

    // Cập nhật giá trị cho BehaviorSubject
    this.menuSubject.next(newMenu);
  }
}
