import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SendEmailComponent } from './send-email.component';
import { MatTooltipModule } from '@angular/material/tooltip';



@NgModule({
  declarations: [
    SendEmailComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    MatTooltipModule
  ],
  exports: [
    SendEmailComponent
  ]
})
export class SendEmailModule { }
