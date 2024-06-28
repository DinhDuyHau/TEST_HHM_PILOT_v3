import { Component, Input } from '@angular/core';
import { MenuItem } from '../header.model';

@Component({
  selector: 'app-menu-header',
  templateUrl: './menu-header.component.html',
  styleUrls: ['./menu-header.component.scss']
})
export class MenuHeaderComponent {
  @Input() items!: MenuItem[];
}

