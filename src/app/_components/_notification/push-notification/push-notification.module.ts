import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PushNotificationComponent } from './push-notification.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    PushNotificationComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule,
  ],
  exports: [PushNotificationComponent]
})
export class PushNotificationModule { }
