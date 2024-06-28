import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { SidebarMobileComponent } from './sidebar-mobile/sidebar-mobile.component';
import { MatMenuModule } from '@angular/material/menu';
import { HomeComponent } from './home/home.component';
import { NotificationModule } from '../_notification/notification/notification.module';



@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    SidebarMobileComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    RouterModule,
    MatIconModule,
    MatDialogModule,
    MatMenuModule,
    NotificationModule
  ],
  exports: [
    HeaderComponent,
    SidebarComponent
  ]
})
export class SharedModule { }
