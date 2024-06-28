import { Component, EventEmitter, Output } from '@angular/core';
import { generateStringDate } from '@app/_common/commonFunction';
import {
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { AuthenticationService, NotificationService } from '@app/_services';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarService } from '../sidebar/sidebar.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  user: any;
  shift: any;
  title = 'Trang chủ';
  now = generateStringDate(new Date());
  showNotication = false;
  notification_count = 0;

  @Output() onShowMenu = new EventEmitter<any>();
  constructor(library: FaIconLibrary, private authenticationService: AuthenticationService, private notificationService: NotificationService,
    private sidebarService: SidebarService,
    private route: Router,
    private activeRoute: ActivatedRoute) {
    library.addIconPacks(fas, far);
    this.authenticationService.user.subscribe(x => {
      if (x !== null) {
        this.user = x;
      }
    });
    this.shift = this.authenticationService.shiftValue?.find(x => x.ma_ca == this.user.shift);
    if (this.route.url !== '/' && this.route.url != '/setting') {
      const menu = this.sidebarService.getMenuFromLocalStorage().filter(item => item.link !== '' && this.route.url.includes(item.link));
      if (menu.length > 1) {
        menu.sort((x, y) => y.link.length - x.link.length);
      }
      this.title = menu[0].bar || '';
    }
    else {
      this.activeRoute.data.subscribe((result: any) => {
        this.title = result.title || '';
      });
      // this.title = this.route.config;
    }
    this.notificationService.getQuantityNewNotificaiton().subscribe((result: any) => {
      if (result.success) {
        this.notification_count = result.result;
      }
    });
  }
  showMenu() {
    this.onShowMenu.emit();
  }
  onShowNotification() {
    this.showNotication = !this.showNotication;
    if (this.notification_count !== 0) {
      this.notification_count = 0;
      this.notificationService.updateStatusNewNotification().subscribe(() => {
        //
      });
    }
  }
  onClickMenu() {
    console.log('click');
  }
}
