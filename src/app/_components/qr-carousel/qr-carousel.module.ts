import { NgModule } from '@angular/core';
import { QRCodeModule } from 'angularx-qrcode';
import { QrCarouselComponent } from './qr-carousel.component';
import { CommonModule } from '@angular/common';
import { DataFormatPipeModule } from '@app/_pipe/dataFormat/data-format.pipe';

@NgModule({
  declarations: [QrCarouselComponent],
  imports: [
    CommonModule,
    DataFormatPipeModule,
    QRCodeModule
  ],
  exports: [QrCarouselComponent],

})
export class QrCarouselModule { }
