import { Component, EventEmitter, Output } from '@angular/core';
import { User } from '@app/_models';
import { AuthenticationService } from '@app/_services';
import { faChevronRight, faChevronLeft, faPowerOff, faUnlockKeyhole } from '@fortawesome/free-solid-svg-icons';
import { SidebarService } from '../sidebar/sidebar.service';
import { MenuItem } from '../sidebar/header.model';
import {
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-sidebar-mobile',
  templateUrl: './sidebar-mobile.component.html',
  styleUrls: ['./sidebar-mobile.component.scss']
})
export class SidebarMobileComponent {
  faChevronRight = faChevronRight;
  faChevronLeft = faChevronLeft;
  faPowerOff = faPowerOff;
  faUnlock = faUnlockKeyhole;
  user: any;
  isExtend = true;
  menuItem: MenuItem[] = [];
  year = new Date().getFullYear();
  @Output() onHideMenu = new EventEmitter<any>();
  constructor(
    private authenticationService: AuthenticationService,
    private sidebarService: SidebarService,
    library: FaIconLibrary,
    public dialogRef: MatDialogRef<SidebarMobileComponent>
  ) {
    library.addIconPacks(fas, far);
    this.authenticationService.user.subscribe(x => {
      if (x !== null) {
        this.user = x;
      }
    });
    // this.menuItem = this.sidebarService.getMenuFromLocalStorage();
    this.sidebarService.getMenuFromLocalStorage2().subscribe((value: any) => {
      this.menuItem = value;
    });
  }
  extend() {
    this.isExtend = !this.isExtend;
  }
  extendMenu(index: number) {
    this.menuItem[index].extend = !this.menuItem[index].extend;
  }

  public castIcon(value: string): IconName {
    return value as IconName;
  }
  hide() {
    this.dialogRef.close();
  }
}
