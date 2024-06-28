import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppService {
  // Ref: https://angular.io/guide/component-interaction#parent-and-children-communicate-via-a-service

  subscription = new Subject<any>();
  childAction$ = this.subscription.asObservable();
  executeAction(arg: any) {
    this.subscription.next(arg);
  }

  //send record count from child to parent component
  private recordCount = new Subject<number>();
  currentRecordCount = this.recordCount.asObservable();
  getCurrentRecordCount(arg: number) {
    this.recordCount.next(arg);
  }

  //send hotkeys from parent to child component
  private hotKeySubscription = new Subject<KeyboardEvent>();
  hotKeysAction$ = this.hotKeySubscription.asObservable();
  executeHotKeysAction(arg: KeyboardEvent) {
    this.hotKeySubscription.next(arg);
  }

}
