import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingChangeComponent } from './setting-change.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



@NgModule({
  declarations: [
    SettingChangeComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule
  ]
})
export class SettingChangeModule { }
