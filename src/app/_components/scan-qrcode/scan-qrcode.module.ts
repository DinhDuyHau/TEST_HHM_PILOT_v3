import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScanQrcodeComponent } from './scan-qrcode.component';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { SafePipe } from './safe.pipe';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SelectCustomComponent } from '../controls/select-custom/select-custom.component';
import { ControlsModule } from '../controls/controls.module';

@NgModule({
  declarations: [
    ScanQrcodeComponent, SafePipe
  ],
  imports: [
    CommonModule, MatIconModule, FormsModule, ZXingScannerModule, MatFormFieldModule, MatProgressSpinnerModule, ControlsModule
  ]
})
export class ScanQrcodeModule { }
