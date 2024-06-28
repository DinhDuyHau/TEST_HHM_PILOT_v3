import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { BehaviorSubject } from 'rxjs';
@Injectable()
export class MessagingService {
    currentMessage = new BehaviorSubject(null);
    constructor(private angularFireMessaging: AngularFireMessaging) {
        this.angularFireMessaging.messages.subscribe(
            (_messaging: any) => {
                _messaging.onMessage = _messaging.onMessage.bind(_messaging);
                _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
            }
        );
    }
    requestPermission(callback: any) {
        this.angularFireMessaging.requestToken.subscribe(
            (token) => {
                callback(token);
            },
            (err) => {
                console.error('Unable to get permission to notify.', err);
            }
        );
    }
    receiveMessage(callback: any) {
        this.angularFireMessaging.messages.subscribe(
            (payload: any) => {
                callback(payload);
                this.currentMessage.next(payload);
            });
    }
}