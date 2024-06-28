import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CameraComponent } from './webcam.component';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { WebcamModule } from 'ngx-webcam';

@NgModule({
  declarations: [
    CameraComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    WebcamModule,
  ],
})
export class CameraModule { }
