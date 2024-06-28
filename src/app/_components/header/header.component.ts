import { Component } from '@angular/core';
import { User } from '@app/_models';
import { AuthenticationService } from '@app/_services';
import { faChevronRight, faPowerOff, faUnlockKeyhole } from '@fortawesome/free-solid-svg-icons';
import { HeaderService } from './header.service';
import { MenuItem } from './header.model';
import {
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { IconName } from '@fortawesome/fontawesome-svg-core';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent {
  faChevronRight = faChevronRight;
  faPowerOff = faPowerOff;
  faUnlock = faUnlockKeyhole;
  user: any;
  menuItem: MenuItem[] = [];
  constructor(
    private authenticationService: AuthenticationService,
    private headerService: HeaderService,
    library: FaIconLibrary
  ) {
    library.addIconPacks(fas, far);
    this.authenticationService.user.subscribe(x => {
      if (x !== null) {
        this.user = x;
      }
    });
    // this.menuItem = this.headerService.getMenuFromLocalStorage();
    this.headerService.getMenuFromLocalStorage2().subscribe((value: any) => {
      this.menuItem = value;
    });
  }

  public castIcon(value: string): IconName {
    return value as IconName;
  }
}
