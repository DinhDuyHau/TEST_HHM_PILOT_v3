import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScanQrcodeModule } from '../scan-qrcode/scan-qrcode.module';
import { ReceiptModule } from './inventory/receipt/receipt.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { StockTranferModule } from './inventory/stock-tranfer/stock-tranfer.module';
import { StockTranferInModule } from './inventory/stock-tranfer-in/stock-tranfer-in.module';
import { InternalSaleModule } from './inventory/internal-sale/internal-sale.module';
import { InternalPurchaseModule } from './inventory/internal-purchase/internal-purchase.module';
import { ReturnSupplierModule } from './inventory/return-supplier/return-supplier.module';
import { OtherReceiptModule } from './money-transaction/other-receipt/other-receipt.module';
import { DebtReceiptModule } from './money-transaction/debt-receipt/debt-receipt.module';
import { OtherPaymentModule } from './money-transaction/other-payment/other-payment.module';
import { DeposistReceiptModule } from './money-transaction/deposist-receipt/deposist-receipt.module';
import { RecommentToUseModule } from './inventory/recomment-to-use/recomment-to-use.module';
import { CloseShiftPaymentModule } from './money-transaction/close-shift-payment/close-shift-payment.module';
import { OtherMoneyTransferModule } from './money-transaction/other-money-transfer/other-money-transfer.module';
import { CollectionReceiptModule } from './money-transaction/collection-receipt/collection-receipt.module';
import { EventGiftModule } from './inventory/event-gift/event-gift.module';
import { DeposistReturnReceiptModule } from './money-transaction/deposist-return-payment/deposist-return-payment.module';
import { LoanOutModule } from './inventory/loan-out/loan-out.module';
import { LoanRecoveryModule } from './inventory/loan-recovery/loan-recovery.module';

import { WarrantyOutModule } from './inventory/warranty-out/warranty-out.module';
import { WarrantyInModule } from './inventory/warranty-in/warranty-in.module';

import { VoucherGridModule } from './voucher/voucher.module';
import { ProposedPurchaseModule } from './inventory/proposed-purchase/proposed-purchase.module';
import { StockShopCheckComponent } from './stock-shop-check/stock-shop-check.component';
import { DepositBaokimModule } from './money-transaction/deposit-baokim/deposit-baokim.module';
import { WithDrawBaokimModule } from './money-transaction/withdraw-baokim/withdraw-baokim.module';
import { RefundBaokimModule } from './money-transaction/refund-baokim/refund-baokim.module';
import { RefundQrBankingModule } from './money-transaction/refund-qrbanking/refund-qrbanking.module';
// import { VoucherComponent } from './voucher.component';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    ProposedPurchaseModule,
    ReceiptModule,
    ScanQrcodeModule,
    MatSnackBarModule,
    StockTranferModule,
    StockTranferInModule,
    InternalSaleModule,
    InternalPurchaseModule,
    ReturnSupplierModule,
    OtherReceiptModule,
    DebtReceiptModule,
    OtherPaymentModule,
    DeposistReceiptModule,
    RecommentToUseModule,
    CloseShiftPaymentModule,
    CollectionReceiptModule,
    DeposistReturnReceiptModule,
    EventGiftModule,
    LoanOutModule,
    LoanRecoveryModule,
    WarrantyOutModule,
    WarrantyInModule,
    VoucherGridModule,
    OtherMoneyTransferModule,
    DepositBaokimModule,
    WithDrawBaokimModule,
    RefundBaokimModule,
    RefundQrBankingModule
  ]
})
export class VoucherModule { }
