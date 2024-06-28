import { Component } from '@angular/core';
import { MessagingService } from './_services/message.service';
import { slideInOutAnimation } from './_animation/slide-in-out.animation';
import { Notification } from './_components/_notification/notification.model';
@Component({ selector: 'app-root', templateUrl: 'app.component.html', animations: [slideInOutAnimation], })
export class AppComponent {
    notification: Notification = {
        title: 'Hoàng Hà Mobile',
        body: 'Chiết khấu đã được cập nhật. Vui lòng truy cập tab chiết khấu để xem thông tin chi tiết 1.14 11111 1111 1111 111 1112 2 31 3213 12321 3123 213 213',
        image: 'https://hhm-shop-inv.genbyte.net/assets/images/logo_small.png',
        notification_id: 1
    };
    animationState = 'out'; // Ban đầu ẩn

    constructor(private messagingService: MessagingService) {
        // const app = initializeApp(environment.firebaseConfig);
    }
    ngOnInit() {
        // this.messagingService.requestPermission();
        this.messagingService.receiveMessage((message: any) => this.showMessage(message));
    }

    showMessage(message: any) {
        if (this.animationState === 'out') {
            this.animationState = 'in';
            this.notification = message.notification;
            if (message.data) {
                if (message.data.redirect) this.notification.redirect = message.data.redirect;
                if (message.data.notification_id) this.notification.notification_id = message.data.notification_id;
            }

            if (!this.notification.image)
                this.notification.image = 'assets/images/logo_small.png';
        }
        else {
            this.notification = message.notification;
        }
    }

    onClickCancelNotification() {
        this.animationState = 'out';
    }
}