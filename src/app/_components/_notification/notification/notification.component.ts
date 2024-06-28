import { Component, OnInit } from '@angular/core';
import { Notification } from '../notification.model';
import { NotificationService } from '@app/_services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  isNotificationAll = true;
  pageIndex = 1;
  pageSize = 20;
  isLoading = false;
  loaded = false;
  notification: Notification = {
    title: 'Hoàng Hà Mobile',
    body: 'Chiết khấu đã được cập nhật. Vui lòng truy cập tab chiết khấu để xem thông tin chi tiết 1.14 11111 1111 1111 111 1112 2 31 3213 12321 3123 213 213',
    image: 'https://hhm-shop-inv.genbyte.net/assets/images/logo_small.png',
    send_date: '5 ngày trước',
    status: '1',
    redirect: '/category/discount2',
    notification_id: 1,
  };
  temp: Notification[] = [this.notification, this.notification, this.notification, this.notification, this.notification, this.notification, this.notification, this.notification, this.notification, this.notification];

  notifications: Notification[] = [];
  constructor(private notificationService: NotificationService, private router: Router) {

  }
  ngOnInit(): void {
    this.loadPage(1);
  }

  onChangeNotification() {
    this.isNotificationAll = !this.isNotificationAll;
    this.isLoading = true;
    this.loadPage(this.pageIndex);
  }

  onScroll(event: Event): void {
    const element = event.target as HTMLElement;
    const atBottom = element.scrollHeight - element.scrollTop === element.clientHeight;

    if (atBottom) {
      this.pageIndex++;
      this.isLoading = true;
      this.loadPage(this.pageIndex + 1);
    }
  }
  loadPage(pageIndex: number): void {
    this.notificationService.getNotification(this.isNotificationAll ? '0' : '1', pageIndex, this.pageSize).subscribe((result: any) => {
      if (result.success) {
        this.notifications = [...this.notifications, ...result.result];
        this.isLoading = false;
        this.loaded = true;
      }
      else {
        this.isLoading = false;
        this.loaded = true;
      }
    });
  }

  onClickRedirect(notification: Notification) {
    if (notification.redirect) {
      if (notification.status !== '2') this.notificationService.updateStatusNotification(notification.notification_id);
      this.router.navigateByUrl(notification.redirect);
    }
  }
  getTime(dateTime: any) {
    const date = new Date(dateTime);
    const khoangThoiGian = new Date().getTime() - date.getTime();

    // Chuyển khoảng thời gian từ mili giây sang giây, phút, giờ, ngày và tháng
    const khoangThoiGianGiay = khoangThoiGian / 1000;
    const khoangThoiGianPhut = khoangThoiGianGiay / 60;
    const khoangThoiGianGio = khoangThoiGianPhut / 60;
    const khoangThoiGianNgay = khoangThoiGianGio / 24;
    const khoangThoiGianThang = khoangThoiGianNgay / 30;
    const khoangThoiGianNam = khoangThoiGianThang / 12;

    // Kiểm tra và hiển thị kết quả dựa trên khoảng thời gian
    if (khoangThoiGianGiay < 60) {
      return `${Math.floor(khoangThoiGianGiay)} giây trước`;
    } else if (khoangThoiGianPhut < 60) {
      return `${Math.floor(khoangThoiGianPhut)} phút trước`;
    } else if (khoangThoiGianGio < 24) {
      return `${Math.floor(khoangThoiGianGio)} giờ trước`;
    } else if (khoangThoiGianNgay < 30) {
      return `${Math.floor(khoangThoiGianNgay)} ngày trước`;
    } else if (khoangThoiGianThang < 12) {
      return `${Math.floor(khoangThoiGianThang)} tháng trước`;
    } else {
      return `${Math.floor(khoangThoiGianNam)} năm trước`;
    }

  }
}
