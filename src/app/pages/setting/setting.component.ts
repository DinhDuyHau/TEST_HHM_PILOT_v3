
import { Dialog } from '@angular/cdk/dialog';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core'; import { ActivatedRoute } from '@angular/router';
import dataFormat from '@app/_common/dataFormat';
import { SidebarService } from '@app/_components/_shared/sidebar/sidebar.service';
import { Field } from '@app/_components/gridV2/grid.model';
import { MenuItem } from '@app/_components/header/header.model';
import { User } from '@app/_models';
import { AuthenticationService } from '@app/_services';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { far } from '@fortawesome/free-regular-svg-icons';
import { faChevronRight, faChevronLeft, faPowerOff, faUnlockKeyhole, fas, IconName } from '@fortawesome/free-solid-svg-icons';
import { of, switchMap } from 'rxjs';
import { SettingChangeComponent } from './setting-change/setting-change.component';
import { MatDialogConfig } from '@angular/material/dialog';
@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent {
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
    private http: HttpClient,
    private dialog: Dialog,
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

  openSettingDialog(menu: MenuItem) {
    // Các trường cho phép thay đổi: title, width, sort, multipleLine, align, hidden
    const type = menu.link.split('/')[1];

    const randomParam = new Date().getTime();
    this.http.get<Field[]>(`assets/fields/report/${menu.sysid}.json?r=${randomParam}`).pipe(
      switchMap(data => {
        data = data.map((item, index) => {
          return { ...new Field(), ...item, dataFormatString: (dataFormat as any)[item.dataFormatString === undefined ? '' : item.dataFormatString], sort: index + 1 };
        });
        return of(data);
      })
    ).subscribe(result => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '100%';
      dialogConfig.height = '90%';
      dialogConfig.disableClose = false;
      dialogConfig.data = result;
      const dialogRef = this.dialog.open(SettingChangeComponent, dialogConfig);
    });

  }

  public castIcon(value: string): IconName {
    return value as IconName;
  }
}
