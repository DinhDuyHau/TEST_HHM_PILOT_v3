import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Notification } from '../notification.model';
import { Router } from '@angular/router';
import { NotificationService } from '@app/_services';

@Component({
  selector: 'app-push-notification',
  templateUrl: './push-notification.component.html',
  styleUrls: ['./push-notification.component.scss']
})
export class PushNotificationComponent {
  @Input() notification!: Notification;
  @Output() handleClickCancel = new EventEmitter<any>();

  constructor(private router: Router, private notificationService: NotificationService) {
    //
  }
  onClickRedirect() {
    this.notificationService.updateStatusNotification(this.notification.notification_id);
    this.router.navigateByUrl(this.notification.redirect || '');
    this.handleClickCancel.emit();
  }

  onClickCancel() {
    this.handleClickCancel.emit();
  }

}
