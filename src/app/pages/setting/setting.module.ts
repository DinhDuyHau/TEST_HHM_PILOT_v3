import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingComponent } from './setting.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



@NgModule({
  declarations: [
    SettingComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
  ]
})
export class SettingModule { }
