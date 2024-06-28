import {
  Component,
  OnInit,
  EventEmitter,
  AfterContentChecked,
} from '@angular/core';
import { first, filter } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';
import { AppService } from './_utils/app.service';
import { Subscription } from 'rxjs';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { AuthenticationService } from './_services';
import { User } from './_models';
import { AlertService } from './_components/_alert';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SidebarMobileComponent } from './_components/_shared/sidebar-mobile/sidebar-mobile.component';

@Component({
  templateUrl: 'app-layout.component.html',
  styleUrls: ['./app-layout.component.scss'],
})
export class AppLayoutComponent implements OnInit {
  shortcut = false;
  current_year: number = new Date().getFullYear();
  user_id = 0;
  recordCount = 0;
  hotkeys?: Hotkey[];
  hidden_menu_box = false;
  user?: User | null;
  options = {
    autoClose: false,
    keepAfterRouteChange: false,
  };
  isMenuFull = true;

  constructor(
    private router: Router,
    private appService: AppService,
    private hotkeysService: HotkeysService,
    private authenticationService: AuthenticationService,
    public alertService: AlertService,
    private dialog: MatDialog
  ) {
    this.authenticationService.user.subscribe(x => (this.user = x));

    //Khởi tạo các phím tắt
    this.registerHotKeys();
  }

  ngOnInit(): void {
    // 
  }

  /**
   * Đăng ký các phím tắt tại layout ngoài cùng
   */
  registerHotKeys() {
    this.hotkeys = [
      new Hotkey('ctrl+f11', (event: KeyboardEvent) =>
        this.hotKeyEventHandle(event),
      ),
      new Hotkey('ctrl+s', (event: KeyboardEvent) =>
        this.hotKeyEventHandle(event),
      ),
    ];
    for (const key of this.hotkeys) {
      this.hotkeysService.add(key);
    }
  }

  /**
   * Xử lý event khi nhấn các phím tắt
   * send hotkey vào cho child component khi fire event
   */
  hotKeyEventHandle(e: KeyboardEvent): boolean {
    const EVENT_VALUE = false;

    //Ctrl + F11: toggle left menu
    if (e.ctrlKey && e.key === 'F11') {
      console.log('ctrl + F11');

      this.appService.executeHotKeysAction(e);
      return EVENT_VALUE;
    }

    //send key to child component
    this.appService.executeHotKeysAction(e);

    /* Prevent bubbling -> fix to FALSE */
    return EVENT_VALUE;
  }
  showMenu() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.position = {
      top: '0',
      left: '0',
      bottom: '0'
    };
    const dialogRef = this.dialog.open(SidebarMobileComponent, dialogConfig);
  }
  showFullMenu(flag: boolean) {
    this.isMenuFull = flag;
  }
}
