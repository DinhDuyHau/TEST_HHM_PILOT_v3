import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectionService {
  private selectedItem = new BehaviorSubject<string | null>(null); // Lưu ID dòng được chọn
  selectedItem$ = this.selectedItem.asObservable(); // Cho phép các component khác subscribe

  setSelectedItem(id: string | null) {
    this.selectedItem.next(id);
  }
}
