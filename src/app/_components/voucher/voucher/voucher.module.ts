import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridV2Module } from '@app/_components/gridV2/gridV2.module';
import { VoucherComponent } from './voucher.component';
@NgModule({
    declarations: [VoucherComponent],
    imports: [
        CommonModule,
        GridV2Module,
    ],
    exports: [VoucherComponent]
})
export class VoucherGridModule { }
