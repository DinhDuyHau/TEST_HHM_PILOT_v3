import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { GridModule } from '@app/_components/grid/grid.module';
import { MatButtonModule } from '@angular/material/button';
import { PaymentTabComponent } from './payment-tab.component';
import { DataFormatPipeModule } from '@app/_pipe/dataFormat/data-format.pipe';
import { FormPaymentCustomModule } from '../../form-control-custom/form-payment-custom/form-payment-custom.module';
import { FormInputCustomModule } from '../../form-control-custom/form-input-custom/form-input-custom.module';
import { DropdownCustomModule } from '../../form-control-custom/dropdown/dropdown.module';
import { DepositSelectModule } from '../../deposit/deposit-select.module';
import { SwipeCardModule } from '../swipe-card/swipe-card.module';
import { EWalletModule } from '../e-wallet/e-wallet.module';
import { TransferModule } from '../transfer/transfer.module';
import { PaymentTabDialogComponent } from './payment-tab-dialog/payment-tab-dialog.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { VNPayModule } from '../vnpay/vnpay.module';
import { QrCarouselModule } from '@app/_components/qr-carousel/qr-carousel.module';

@NgModule({
    declarations: [PaymentTabComponent, PaymentTabDialogComponent],
    imports: [
        CommonModule,
        MatDialogModule,
        MatFormFieldModule,
        FormsModule,
        MatIconModule,
        GridModule,
        MatButtonModule,
        DataFormatPipeModule,
        FormPaymentCustomModule,
        FormInputCustomModule,
        DropdownCustomModule,
        DepositSelectModule,
        SwipeCardModule,
        EWalletModule,
        VNPayModule,
        TransferModule,
        FontAwesomeModule,
        QrCarouselModule
    ],
    exports: [PaymentTabComponent],

})
export class PaymentTabModule { }
