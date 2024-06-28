import { Component, EventEmitter, Output } from '@angular/core';
import { User } from '@app/_models';
import { AuthenticationService } from '@app/_services';
import { faChevronRight, faChevronLeft, faPowerOff, faUnlockKeyhole } from '@fortawesome/free-solid-svg-icons';
import { SidebarService } from './sidebar.service';
import {
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from './header.model';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  faChevronRight = faChevronRight;
  faChevronLeft = faChevronLeft;
  faPowerOff = faPowerOff;
  faUnlock = faUnlockKeyhole;
  user: any;
  isExtend = true;
  menuItem: MenuItem[] = [];
  year = new Date().getFullYear();
  @Output() onClickMenu = new EventEmitter<boolean>();
  constructor(
    private authenticationService: AuthenticationService,
    private sidebarService: SidebarService,
    private route: ActivatedRoute,
    library: FaIconLibrary,
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
      this.route.url.subscribe(urlSegment => {
        if (urlSegment.length < 2)
          return;
        const path = '/' + urlSegment[0].path + '/' + urlSegment[1].path;
        let index_extend = -1;
        this.menuItem.forEach((item, index) => {
          const a = item.children.find((child) => {
            return child.link == path;
          });
          if (a) {
            index_extend = index;
          }
        });
        if (index_extend != -1) {
          this.extendMenu(index_extend);
        }
      });
    });

  }
  extend() {
    this.isExtend = !this.isExtend;
    this.onClickMenu.emit(this.isExtend);
  }
  extendMenu(index: number) {
    this.menuItem[index].extend = !this.menuItem[index].extend;
  }

  public castIcon(value: string): IconName {
    return value as IconName;
  }
}
