import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { MenuItem, MenuItemApi } from './header.model';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
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
    return this.parseMenu(this.menuSubject.value || []);
  }

  getMenuFromLocalStorage2(): Observable<any> {
    const menu = this.parseMenu(JSON.parse(localStorage.getItem('menu')!));
    return of(menu);
  }

  parseMenu(data: MenuItem[]): any {
    const map = new Map<string, MenuItem>();
    const roots: MenuItem[] = [];

    // Create a map of all menu items
    data.forEach(item => {
      item.children = [];
      map.set(item.menu_id, item);
    });

    // Build the tree
    data.forEach(item => {
      const parent = map.get(item.wmenu_id0);
      if (parent) {
        parent.children.push(item);
      } else {
        roots.push(item);
      }
    });

    return roots;
  }
}
