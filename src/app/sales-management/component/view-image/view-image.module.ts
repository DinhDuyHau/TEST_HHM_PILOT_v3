import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewImageComponent } from './view-image.component';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ViewImageComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
  ],
})
export class ViewImageModule { }
