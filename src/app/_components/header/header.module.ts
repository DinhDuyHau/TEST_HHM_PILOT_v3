import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { RouterModule } from '@angular/router';
import { MenuHeaderComponent } from './menu-header/menu-header.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';



@NgModule({
  declarations: [HeaderComponent, MenuHeaderComponent],
  imports: [
    CommonModule, RouterModule, FontAwesomeModule, MatMenuModule, MatIconModule, MatToolbarModule
  ],
  exports: [HeaderComponent]
})
export class HeaderModule { }
