import { SaleGiftRepayModule } from './sales-management/page/sale-gift-repay/sale-gift-repay.module';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, Route } from '@angular/router';
import { LoginComponent, LogoutComponent } from './login';
import { AuthGuard } from './_helpers';
import { AppLayoutComponent } from './app-layout.component';
// import { TestComponent } from './_components/test/test.component';
import { CustomerComponent } from './_components/category/customer/customer.component';
import { CreateCustomerComponent } from './_components/category/customer/create/create.component';
import { RetailComponent } from './sales-management/page/retail';
import { SaleOnlineComponent } from './sales-management/page/sale-online/hh-web/sale-online.component';
import { SaleWholeComponent } from './sales-management/page/sale-whole';
import { SaleAffiliateComponent } from './sales-management/page/sale-affiliate';
import { ContractComponent } from './sales-management/page/contract';
import { SaleItinerantComponent } from './sales-management/page/sale-itinerant';
import { SaleServiceComponent } from './sales-management/page/sale-service';
import { TicketComponent } from './sales-management/page/ticket/ticket.component';
import { SaleWithTelecomComponent } from './sales-management/page/sale-with-telecom/sale-with-telecom.component';
import { TICKET_TYPE } from './sales-management/enum/ticket.enum';
import { SaleReturnComponent } from './sales-management/page/sale-return';
import { SaleReturnServiceComponent } from './sales-management/page/sale-return-service';
import { SaleChangeComponent } from './sales-management/page/sale-change';
import { SaleGiftRepayComponent } from './sales-management/page/sale-gift-repay';
import { SaleRepurchaseComponent } from './sales-management/page/sale-repurchase';
import { SaleRenewComponent } from './sales-management/page/sale-renew';
import { SaleRepurchaseServiceComponent } from './sales-management/page/sale-repurchase-service';

import { CreateReceiptComponent } from './_components/voucher/inventory/receipt/create/create.component';
import { SaleOnlineEcommerceComponent } from './sales-management/page/sale-online/ecommerce';
import { StockTranferCreateComponent } from './_components/voucher/inventory/stock-tranfer/create/create.component';
import { StockTranferInCreateComponent } from './_components/voucher/inventory/stock-tranfer-in/create/create.component';
import { InternalPurchaseCreateComponent } from './_components/voucher/inventory/internal-purchase/create/create.component';
import { InternalSaleCreateComponent } from './_components/voucher/inventory/internal-sale/create/create.component';
import { ReturnSupplierDetailComponent } from './_components/voucher/inventory/return-supplier/create/create.component';
import { OtherReceiptDetailComponent } from './_components/voucher/money-transaction/other-receipt/create/create.component';
import { DebtReceiptDetailComponent } from './_components/voucher/money-transaction/debt-receipt/create/create.component';
import { OtherPaymentDetailComponent } from './_components/voucher/money-transaction/other-payment/create/create.component';
import { DeposistReceiptDetailComponent } from './_components/voucher/money-transaction/deposist-receipt/create/create.component';
import { RecommentToUseDetailComponent } from './_components/voucher/inventory/recomment-to-use/create/create.component';
import { CloseShiftPaymentDetailComponent } from './_components/voucher/money-transaction/close-shift-payment/create/create.component';
import { CollectionReceiptDetailComponent } from './_components/voucher/money-transaction/collection-receipt/create/create.component';
import { EventGiftDetailComponent } from './_components/voucher/inventory/event-gift/create/create.component';
import { DeposistReturnReceiptDetailComponent } from './_components/voucher/money-transaction/deposist-return-payment/create/create.component';
import { LoanOutDetailComponent } from './_components/voucher/inventory/loan-out/create/create.component';
import { LoanRecoveryDetailComponent } from './_components/voucher/inventory/loan-recovery/create/create.component';

import { WarrantyOutDetailComponent } from './_components/voucher/inventory/warranty-out/create/create.component';
import { WarrantyInDetailComponent } from './_components/voucher/inventory/warranty-in/create/create.component';

import { VoucherComponent } from './_components/voucher/voucher/voucher.component';
import { VOUCHER_TYPE } from './_components/voucher/enum/voucher_enum';
import { getRouteCategoryNotExists, getRouteReportNotExists } from './_common/commonFunction';
import { ReportComponent } from './_components/report/report.component';
import { CategoryComponent } from './_components/category/category.component';
import { ProposedPurchaseCreateComponent } from './_components/voucher/inventory/proposed-purchase/create/create.component';
import { SaleReturnOnlineComponent } from './sales-management/page/sale-return-online';
import { BarcodeScannerComponent } from './test/test.component';
import { Home2Component } from './test/home/home.component';
import { ScanComponent } from './test/scan/scan.component';
import { ScanSingleComponent } from './test/scan-single/scan-single.component';
import { SettingComponent } from './pages/setting/setting.component';
import { StockTransferFromShopComponent } from './_components/voucher/stock-transfer/from-shop/stock-transfer-from-shop.component';
import { StockTransferInShopComponent } from './_components/voucher/stock-transfer/in-shop/stock-transfer-in-shop.component';
import { StockShopCheckComponent } from './_components/voucher/stock-shop-check/stock-shop-check.component';
// import { TicketComponent } from './_components/ticket/ticket.component';

import { VoucherCompensationComponent } from './sales-management/page/voucher-compensation';
import { ServiceCompensationComponent } from './sales-management/page/voucher-service-compensation';
import { ChangepassComponent } from './pages/changepass/changepass.component';

import { OtherMoneyTransferDetailComponent } from './_components/voucher/money-transaction/other-money-transfer/create/create.component';
import { DepositBaokimDetailComponent } from './_components/voucher/money-transaction/deposit-baokim/create/create.component';
import { WithdrawBaokimDetailComponent } from './_components/voucher/money-transaction/withdraw-baokim/create/create.component';


const homeModule = () => import('./home/home.module').then(x => x.HomeModule);
const customer = () => import('./sales-management/component/customer/customer-create-dialog/customer-create-dialog.module').then(x => x.CustomerCreateDialogModule);
const delivery = () => import('./sales-management/component/delivery/infomation/delivery-infomation.module').then(x => x.DeliveryInfomationModule);
const ticketModule = () => import('./sales-management/page/ticket/ticket.module').then(x => x.TicketModule);
const retailModule = () => import('./sales-management/page/retail/retail.module').then(x => x.RetailModule);
const saleOnlineModule = () => import('./sales-management/page/sale-online/hh-web/sale-online.module').then(x => x.SaleOnlineModule);
const saleOnlineEcommerceModule = () => import('./sales-management/page/sale-online/ecommerce/sale-online-ecommerce.module').then(x => x.SaleOnlineEcommerceModule);
const saleAffiliateModule = () => import('./sales-management/page/sale-affiliate/sale-affiliate.module').then(x => x.SaleAffiliateModule);
const saleWithTelecomModule = () => import('./sales-management/page/sale-with-telecom/sale-with-telecom.module').then(x => x.SaleWithTelecomModule);
const contractModule = () => import('./sales-management/page/contract/contract.module').then(x => x.ContractModule);
const saleWholeModule = () => import('./sales-management/page/sale-whole/sale-whole.module').then(x => x.SaleWholeModule);
const saleItinerantModule = () => import('./sales-management/page/sale-itinerant/sale-itinerant.module').then(x => x.SaleItinerantModule);
const saleServiceModule = () => import('./sales-management/page/sale-service/sale-service.module').then(x => x.SaleServiceModule);
const saleReturnModule = () => import('./sales-management/page/sale-return/sale-return.module').then(x => x.SaleReturnModule);
const saleReturnOnlineModule = () => import('./sales-management/page/sale-return-online/sale-return-online.module').then(x => x.SaleReturnOnlineModule);
const saleReturnServiceModule = () => import('./sales-management/page/sale-return-service/sale-return-service.module').then(x => x.SaleReturnServiceModule);
const saleChangeModule = () => import('./sales-management/page/sale-change/sale-change.module').then(x => x.SaleChangeModule);
const saleGiftRepayModule = () => import('./sales-management/page/sale-gift-repay/sale-gift-repay.module').then(x => x.SaleGiftRepayModule);
const saleRepurchaseModule = () => import('./sales-management/page/sale-repurchase/sale-repurchase.module').then(x => x.SaleRepurchaseModule);
const saleRepurchaseServiceModule = () => import('./sales-management/page/sale-repurchase-service/sale-repurchase-service.module').then(x => x.SaleRepurchaseServiceModule);
const saleRenewModule = () => import('./sales-management/page/sale-renew/sale-renew.module').then(x => x.SaleRenewModule);
const serivceForImeiModule = () => import('./sales-management/component/merchandise-service/service-for-imei/service-for-imei.module').then(x => x.ServiceForImeiModule);
const serivceOrderModule = () => import('./sales-management/component/merchandise-service/service-order/service-order.module').then(x => x.ServiceOrderModule);
const advancedSearchModule = () => import('./sales-management/component/advanced-search/advanced-search-dialog.module').then(x => x.AdvancedSearchDialogModule);
const StockTransferFromShopModule = () => import('@app/_components/voucher/stock-transfer/from-shop/stock-transfer-from-shop.module');
const stockTransferInShopModule = () => import('@app/_components/voucher/stock-transfer/in-shop/stock-transfer-in-shop.module');
const stockShopCheckModule = () => import('@app/_components/voucher/stock-shop-check/stock-shop-check.module');

const voucherCompensationModule = () => import('./sales-management/page/voucher-compensation/voucher-compensation.module').then(x => x.VoucherCompensationModule);
const serviceCompensationModule = () => import('./sales-management/page/voucher-service-compensation/service-compensation.module').then(x => x.ServiceCompensationModule);

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  // { path: 'test', component: BarcodeScannerComponent },
  // { path: 'home', component: Home2Component },
  // { path: 'scan', component: ScanComponent },
  // { path: 'scan-single', component: ScanSingleComponent },
  // { path: 'customer', component: CustomerComponent },
  {
    path: 'setting', component: AppLayoutComponent, canActivate: [AuthGuard], data: { title: 'Cài đặt' },
    children: [
      { path: '', component: SettingComponent, canActivate: [AuthGuard] },
    ]
  },
  {
    path: 'changepass', component: AppLayoutComponent, canActivate: [AuthGuard], data: { title: 'Đổi mật khẩu' },
    children: [
      { path: '', component: ChangepassComponent, canActivate: [AuthGuard] },
    ]
  },
  {
    path: 'category/customer', component: AppLayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: CustomerComponent, canActivate: [AuthGuard] },
      { path: 'create', component: CreateCustomerComponent, canActivate: [AuthGuard] },
      // { path: 'update', component: CreateCustomerComponent, canActivate: [AuthGuard] },
      { path: 'view', component: CreateCustomerComponent, canActivate: [AuthGuard] }
    ]
  },
  {
    path: 'voucher/proposed-purchase', component: AppLayoutComponent, canActivate: [AuthGuard],
    children: [
      //{ path: '', component: VoucherComponent, canActivate: [AuthGuard], data: VOUCHER_TYPE.PROPOSEDPURCHASE },
      { path: '', component: TicketComponent, canActivate: [AuthGuard], data: { ticketType: TICKET_TYPE.STOCK_PROPOSEDPURCHASE, reuse: true } },
      { path: 'create', component: ProposedPurchaseCreateComponent, canActivate: [AuthGuard] },
      { path: 'update', component: ProposedPurchaseCreateComponent, canActivate: [AuthGuard] },
      { path: 'view', component: ProposedPurchaseCreateComponent, canActivate: [AuthGuard] },
    ]
  },
  {
    path: 'voucher/receipt', component: AppLayoutComponent, canActivate: [AuthGuard],
    children: [
      // { path: '', component: VoucherComponent, canActivate: [AuthGuard], data: VOUCHER_TYPE.RECEIPT },
      { path: '', component: TicketComponent, canActivate: [AuthGuard], data: { ticketType: TICKET_TYPE.STOCK_RECEIPT, reuse: true } },
      { path: 'create', component: CreateReceiptComponent, canActivate: [AuthGuard] },
      { path: 'update', component: CreateReceiptComponent, canActivate: [AuthGuard] },
      { path: 'view', component: CreateReceiptComponent, canActivate: [AuthGuard] },
    ]
  },
  /* {
    path: 'voucher/receipt2', component: AppLayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: VoucherComponent, canActivate: [AuthGuard], data: VOUCHER_TYPE.RECEIPT2 },
      { path: 'create', component: CreateReceiptComponent, canActivate: [AuthGuard] },
      { path: 'update', component: CreateReceiptComponent, canActivate: [AuthGuard] },
      { path: 'view', component: CreateReceiptComponent, canActivate: [AuthGuard] },
    ]
  }, */
  {
    path: 'voucher/stock-tranfer', component: AppLayoutComponent, canActivate: [AuthGuard],
    children: [
      //{ path: '', component: VoucherComponent, canActivate: [AuthGuard], data: VOUCHER_TYPE.STOCK_TRANFER },
      { path: '', component: TicketComponent, canActivate: [AuthGuard], data: { ticketType: TICKET_TYPE.STOCK_TRANFER, reuse: true } },
      { path: 'create', component: StockTranferCreateComponent, canActivate: [AuthGuard] },
      { path: 'update', component: StockTranferCreateComponent, canActivate: [AuthGuard] },
      { path: 'view', component: StockTranferCreateComponent, canActivate: [AuthGuard] },
    ]
  },
  {
    path: 'voucher/stock-tranfer-in', component: AppLayoutComponent, canActivate: [AuthGuard],
    children: [
      //{ path: '', component: VoucherComponent, canActivate: [AuthGuard], data: VOUCHER_TYPE.STOCK_TRANFER_IN },
      { path: '', component: TicketComponent, canActivate: [AuthGuard], data: { ticketType: TICKET_TYPE.STOCK_TRANFER_IN, reuse: true } },
      { path: 'create', component: StockTranferInCreateComponent, canActivate: [AuthGuard] },
      { path: 'update', component: StockTranferInCreateComponent, canActivate: [AuthGuard] },
      { path: 'view', component: StockTranferInCreateComponent, canActivate: [AuthGuard] },
    ]
  },
  {
    path: 'voucher/internal-sale', component: AppLayoutComponent, canActivate: [AuthGuard],
    children: [
      //{ path: '', component: VoucherComponent, canActivate: [AuthGuard], data: VOUCHER_TYPE.INTERNAL_SALE },
      { path: '', component: TicketComponent, canActivate: [AuthGuard], data: { ticketType: TICKET_TYPE.STOCK_INTERNAL_SALE, reuse: true } },
      { path: 'create', component: InternalSaleCreateComponent, canActivate: [AuthGuard] },
      { path: 'update', component: InternalSaleCreateComponent, canActivate: [AuthGuard] },
      { path: 'view', component: InternalSaleCreateComponent, canActivate: [AuthGuard] },
    ]
  },
  {
    path: 'voucher/internal-purchase', component: AppLayoutComponent, canActivate: [AuthGuard],
    children: [
      //{ path: '', component: VoucherComponent, canActivate: [AuthGuard], data: VOUCHER_TYPE.INTERNAL_PURCHASE },
      { path: '', component: TicketComponent, canActivate: [AuthGuard], data: { ticketType: TICKET_TYPE.STOCK_INTERNAL_PURCHASE, reuse: true } },
      { path: 'create', component: InternalPurchaseCreateComponent, canActivate: [AuthGuard] },
      { path: 'update', component: InternalPurchaseCreateComponent, canActivate: [AuthGuard] },
      { path: 'view', component: InternalPurchaseCreateComponent, canActivate: [AuthGuard] },
    ]
  },
  {
    path: 'voucher/return-supplier', component: AppLayoutComponent, canActivate: [AuthGuard],
    children: [
      // { path: '', component: VoucherComponent, canActivate: [AuthGuard], data: VOUCHER_TYPE.RETURN_SUPPILER },
      { path: '', component: TicketComponent, canActivate: [AuthGuard], data: { ticketType: TICKET_TYPE.STOCK_RETURN_SUPPILER, reuse: true } },
      { path: 'create', component: ReturnSupplierDetailComponent, canActivate: [AuthGuard] },
      { path: 'update', component: ReturnSupplierDetailComponent, canActivate: [AuthGuard] },
      { path: 'view', component: ReturnSupplierDetailComponent, canActivate: [AuthGuard] },
    ]
  },
  {
    path: 'voucher/other-receipt', component: AppLayoutComponent, canActivate: [AuthGuard],
    children: [
      // { path: '', component: VoucherComponent, canActivate: [AuthGuard], data: VOUCHER_TYPE.OTHER_RECEIPT },
      { path: '', component: TicketComponent, canActivate: [AuthGuard], data: { ticketType: TICKET_TYPE.STOCK_OTHER_RECEIPT, reuse: true } },
      { path: 'create', component: OtherReceiptDetailComponent, canActivate: [AuthGuard] },
      { path: 'update', component: OtherReceiptDetailComponent, canActivate: [AuthGuard] },
      { path: 'view', component: OtherReceiptDetailComponent, canActivate: [AuthGuard] },
    ]
  },
  {
    path: 'voucher/deposit-baokim', component: AppLayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: TicketComponent, canActivate: [AuthGuard], data: { ticketType: TICKET_TYPE.DEPOSIT_BAOKIM, reuse: true } },
      { path: 'create', component: DepositBaokimDetailComponent, canActivate: [AuthGuard] },
      { path: 'update', component: DepositBaokimDetailComponent, canActivate: [AuthGuard] },
      { path: 'view', component: DepositBaokimDetailComponent, canActivate: [AuthGuard] },
    ]
  },
  {
    path: 'voucher/debt-receipt', component: AppLayoutComponent, canActivate: [AuthGuard],
    children: [
      // { path: '', component: VoucherComponent, canActivate: [AuthGuard], data: VOUCHER_TYPE.DEBT_RECEIPT },
      { path: '', component: TicketComponent, canActivate: [AuthGuard], data: { ticketType: TICKET_TYPE.STOCK_DEBT_RECEIPT, reuse: true } }, { path: 'create', component: DebtReceiptDetailComponent, canActivate: [AuthGuard] },
      { path: 'update', component: DebtReceiptDetailComponent, canActivate: [AuthGuard] },
      { path: 'view', component: DebtReceiptDetailComponent, canActivate: [AuthGuard] },
    ]
  },
  {
    path: 'voucher/other-payment', component: AppLayoutComponent, canActivate: [AuthGuard],
    children: [
      // { path: '', component: VoucherComponent, canActivate: [AuthGuard], data: VOUCHER_TYPE.OTHER_PAYMENT },
      { path: '', component: TicketComponent, canActivate: [AuthGuard], data: { ticketType: TICKET_TYPE.OTHER_PAYMENT, reuse: true } },
      { path: 'create', component: OtherPaymentDetailComponent, canActivate: [AuthGuard] },
      { path: 'update', component: OtherPaymentDetailComponent, canActivate: [AuthGuard] },
      { path: 'view', component: OtherPaymentDetailComponent, canActivate: [AuthGuard] },
    ]
  },
  {
    path: 'voucher/deposist-receipt', component: AppLayoutComponent, canActivate: [AuthGuard],
    children: [
      // { path: '', component: VoucherComponent, canActivate: [AuthGuard], data: VOUCHER_TYPE.DEPOSIST_RECEIPT },
      { path: '', component: TicketComponent, canActivate: [AuthGuard], data: { ticketType: TICKET_TYPE.STOCK_DEPOSIST_RECEIPT, reuse: true } },
      { path: 'create', component: DeposistReceiptDetailComponent, canActivate: [AuthGuard] },
      { path: 'update', component: DeposistReceiptDetailComponent, canActivate: [AuthGuard] },
      { path: 'view', component: DeposistReceiptDetailComponent, canActivate: [AuthGuard] },
    ]
  },
  {
    path: 'voucher/recomment-to-use', component: AppLayoutComponent, canActivate: [AuthGuard],
    children: [
      // { path: '', component: VoucherComponent, canActivate: [AuthGuard], data: VOUCHER_TYPE.RECOMMENT_TO_USE },
      { path: '', component: TicketComponent, canActivate: [AuthGuard], data: { ticketType: TICKET_TYPE.STOCK_RECOMMENT_TO_USE, reuse: true } },
      { path: 'create', component: RecommentToUseDetailComponent, canActivate: [AuthGuard] },
      { path: 'update', component: RecommentToUseDetailComponent, canActivate: [AuthGuard] },
      { path: 'view', component: RecommentToUseDetailComponent, canActivate: [AuthGuard] },
    ]
  },
  {
    path: 'voucher/withdraw-baokim', component: AppLayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: TicketComponent, canActivate: [AuthGuard], data: { ticketType: TICKET_TYPE.WITHDRAW_BAOKIM, reuse: true } },
      { path: 'create', component: WithdrawBaokimDetailComponent, canActivate: [AuthGuard] },
      { path: 'update', component: WithdrawBaokimDetailComponent, canActivate: [AuthGuard] },
      { path: 'view', component: WithdrawBaokimDetailComponent, canActivate: [AuthGuard] },
    ]
  },
  {
    path: 'voucher/event-gift', component: AppLayoutComponent, canActivate: [AuthGuard],
    children: [
      // { path: '', component: VoucherComponent, canActivate: [AuthGuard], data: VOUCHER_TYPE.EVENT_GIFT },
      { path: '', component: TicketComponent, canActivate: [AuthGuard], data: { ticketType: TICKET_TYPE.STOCK_EVENT_GIFT, reuse: true } },
      { path: 'create', component: EventGiftDetailComponent, canActivate: [AuthGuard] },
      { path: 'update', component: EventGiftDetailComponent, canActivate: [AuthGuard] },
      { path: 'view', component: EventGiftDetailComponent, canActivate: [AuthGuard] },
    ]
  },
  {
    path: 'voucher/loan-out', component: AppLayoutComponent, canActivate: [AuthGuard],
    children: [
      // { path: '', component: VoucherComponent, canActivate: [AuthGuard], data: VOUCHER_TYPE.LOAN_OUT },
      { path: '', component: TicketComponent, canActivate: [AuthGuard], data: { ticketType: TICKET_TYPE.STOCK_LOAN_OUT, reuse: true } },
      { path: 'create', component: LoanOutDetailComponent, canActivate: [AuthGuard] },
      { path: 'update', component: LoanOutDetailComponent, canActivate: [AuthGuard] },
      { path: 'view', component: LoanOutDetailComponent, canActivate: [AuthGuard] },
    ]
  },
  {
    path: 'voucher/loan-recovery', component: AppLayoutComponent, canActivate: [AuthGuard],
    children: [
      // { path: '', component: VoucherComponent, canActivate: [AuthGuard], data: VOUCHER_TYPE.LOAN_RECOVERY },
      { path: '', component: TicketComponent, canActivate: [AuthGuard], data: { ticketType: TICKET_TYPE.STOCK_LOAN_RECOVERY, reuse: true } },
      { path: 'create', component: LoanRecoveryDetailComponent, canActivate: [AuthGuard] },
      { path: 'update', component: LoanRecoveryDetailComponent, canActivate: [AuthGuard] },
      { path: 'view', component: LoanRecoveryDetailComponent, canActivate: [AuthGuard] },
    ]
  },
  {
    path: 'voucher/warranty-out', component: AppLayoutComponent, canActivate: [AuthGuard],
    children: [
      // { path: '', component: VoucherComponent, canActivate: [AuthGuard], data: VOUCHER_TYPE.WARRANTY_OUT },
      { path: '', component: TicketComponent, canActivate: [AuthGuard], data: { ticketType: TICKET_TYPE.STOCK_WARRANTY_OUT, reuse: true } },
      { path: 'create', component: WarrantyOutDetailComponent, canActivate: [AuthGuard] },
      { path: 'update', component: WarrantyOutDetailComponent, canActivate: [AuthGuard] },
      { path: 'view', component: WarrantyOutDetailComponent, canActivate: [AuthGuard] },
    ]
  },
  {
    path: 'voucher/warranty-in', component: AppLayoutComponent, canActivate: [AuthGuard],
    children: [
      // { path: '', component: VoucherComponent, canActivate: [AuthGuard], data: VOUCHER_TYPE.WARRANTY_IN },
      { path: '', component: TicketComponent, canActivate: [AuthGuard], data: { ticketType: TICKET_TYPE.STOCK_WARRANTY_IN, reuse: true } },
      { path: 'create', component: WarrantyInDetailComponent, canActivate: [AuthGuard] },
      { path: 'update', component: WarrantyInDetailComponent, canActivate: [AuthGuard] },
      { path: 'view', component: WarrantyInDetailComponent, canActivate: [AuthGuard] },
    ]
  },
  {
    path: 'voucher/close-shift-payment', component: AppLayoutComponent, canActivate: [AuthGuard],
    children: [
      // { path: '', component: VoucherComponent, canActivate: [AuthGuard], data: VOUCHER_TYPE.CLOSE_SHIFT_PAYMENT },
      { path: '', component: TicketComponent, canActivate: [AuthGuard], data: { ticketType: TICKET_TYPE.CLOSE_SHIFT_PAYMENT, reuse: true } },
      { path: 'create', component: CloseShiftPaymentDetailComponent, canActivate: [AuthGuard] },
      { path: 'update', component: CloseShiftPaymentDetailComponent, canActivate: [AuthGuard] },
      { path: 'view', component: CloseShiftPaymentDetailComponent, canActivate: [AuthGuard] },
    ]
  },
  {
    path: 'voucher/collection-receipt', component: AppLayoutComponent, canActivate: [AuthGuard],
    children: [
      // { path: '', component: VoucherComponent, canActivate: [AuthGuard], data: VOUCHER_TYPE.COLLECTION_RECEIPT },
      { path: '', component: TicketComponent, canActivate: [AuthGuard], data: { ticketType: TICKET_TYPE.STOCK_COLLECTION_RECEIPT, reuse: true } },
      { path: 'create', component: CollectionReceiptDetailComponent, canActivate: [AuthGuard] },
      { path: 'update', component: CollectionReceiptDetailComponent, canActivate: [AuthGuard] },
      { path: 'view', component: CollectionReceiptDetailComponent, canActivate: [AuthGuard] },
    ]
  },
  {
    path: 'voucher/deposit-return-payment', component: AppLayoutComponent, canActivate: [AuthGuard],
    children: [
      // { path: '', component: VoucherComponent, canActivate: [AuthGuard], data: VOUCHER_TYPE.DEPOSIST_RETURN_PAYMENT },
      { path: '', component: TicketComponent, canActivate: [AuthGuard], data: { ticketType: TICKET_TYPE.DEPOSIST_RETURN_PAYMENT, reuse: true } },
      { path: 'create', component: DeposistReturnReceiptDetailComponent, canActivate: [AuthGuard] },
      { path: 'update', component: DeposistReturnReceiptDetailComponent, canActivate: [AuthGuard] },
      { path: 'view', component: DeposistReturnReceiptDetailComponent, canActivate: [AuthGuard] },
    ]
  },
  {
    path: 'voucher/stock-tranfer-from-shop', component: AppLayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: TicketComponent, canActivate: [AuthGuard], data: { ticketType: TICKET_TYPE.VOUCHER_STOCK_TRANSFER_FROM_SHOP, reuse: true } },
      { path: 'create', component: StockTransferFromShopComponent, canActivate: [AuthGuard] },
      { path: 'update', component: StockTransferFromShopComponent, canActivate: [AuthGuard] },
      { path: 'view', component: StockTransferFromShopComponent, canActivate: [AuthGuard] },
    ]
  },
  {
    path: 'voucher/stock-tranfer-in-shop', component: AppLayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: TicketComponent, canActivate: [AuthGuard], data: { ticketType: TICKET_TYPE.VOUCHER_STOCK_TRANSFER_IN_SHOP, reuse: true } },
      { path: 'update', component: StockTransferInShopComponent, canActivate: [AuthGuard] },
      { path: 'view', component: StockTransferInShopComponent, canActivate: [AuthGuard] },
    ]
  },
  {
    path: 'voucher/stock-shop-check', component: AppLayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: TicketComponent, canActivate: [AuthGuard], data: { ticketType: TICKET_TYPE.VOUCHER_STOCK_SHOP_CHECK, reuse: true } },
      { path: 'create', component: StockShopCheckComponent, canActivate: [AuthGuard] },
      { path: 'update', component: StockShopCheckComponent, canActivate: [AuthGuard] },
      { path: 'view', component: StockShopCheckComponent, canActivate: [AuthGuard] },
    ]
  },
  {
    path: '', component: AppLayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: '', loadChildren: homeModule, canActivate: [AuthGuard] },
      // { path: 'users', loadChildren: usersModule, canActivate: [AuthGuard] },
      // { path: 'app', loadChildren: nodeRoutingModule, canActivate: [AuthGuard] },

    ]
  },
  {
    path: 'sales/retail', component: AppLayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: TicketComponent, canActivate: [AuthGuard], data: { ticketType: TICKET_TYPE.RETAIL, reuse: true } },
      { path: 'create', component: RetailComponent, canActivate: [AuthGuard] },
      { path: 'update', component: RetailComponent, canActivate: [AuthGuard] },
      { path: 'view', component: RetailComponent, canActivate: [AuthGuard] },
    ]
  },
  {
    path: 'sales/web-order', component: AppLayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: TicketComponent, canActivate: [AuthGuard], data: { ticketType: TICKET_TYPE.SALE_ONLINE, reuse: true } },
      { path: 'create', component: SaleOnlineComponent, canActivate: [AuthGuard] },
      { path: 'update', component: SaleOnlineComponent, canActivate: [AuthGuard] },
      { path: 'view', component: SaleOnlineComponent, canActivate: [AuthGuard] },
    ]
  },
  {
    path: 'sales/online', component: AppLayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: TicketComponent, canActivate: [AuthGuard], data: { ticketType: TICKET_TYPE.SALE_ONLINE_ECOMMERCE, reuse: true } },
      { path: 'create', component: SaleOnlineEcommerceComponent, canActivate: [AuthGuard] },
      { path: 'update', component: SaleOnlineEcommerceComponent, canActivate: [AuthGuard] },
      { path: 'view', component: SaleOnlineEcommerceComponent, canActivate: [AuthGuard] },
    ]
  },
  {
    path: 'sales/whole', component: AppLayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: TicketComponent, canActivate: [AuthGuard], data: { ticketType: TICKET_TYPE.SALE_WHOLE, reuse: true } },
      { path: 'create', component: SaleWholeComponent, canActivate: [AuthGuard] },
      { path: 'update', component: SaleWholeComponent, canActivate: [AuthGuard] },
      { path: 'view', component: SaleWholeComponent, canActivate: [AuthGuard] },
    ]
  },
  {
    path: 'sales/affiliate', component: AppLayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: TicketComponent, canActivate: [AuthGuard], data: { ticketType: TICKET_TYPE.SALE_AFFILIATE, reuse: true } },
      { path: 'create', component: SaleAffiliateComponent, canActivate: [AuthGuard] },
      { path: 'update', component: SaleAffiliateComponent, canActivate: [AuthGuard] },
      { path: 'view', component: SaleAffiliateComponent, canActivate: [AuthGuard] },
    ]
  },
  {
    path: 'contract', component: AppLayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: TicketComponent, canActivate: [AuthGuard], data: { ticketType: TICKET_TYPE.SALE_CONTRACT, reuse: true } },
      { path: 'create', component: ContractComponent, canActivate: [AuthGuard] },
      { path: 'update', component: ContractComponent, canActivate: [AuthGuard] },
      { path: 'view', component: ContractComponent, canActivate: [AuthGuard] },
    ]
  },
  {
    path: 'sales/telecom', component: AppLayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: TicketComponent, canActivate: [AuthGuard], data: { ticketType: TICKET_TYPE.SALE_TELECOM, reuse: true } },
      { path: 'create', component: SaleWithTelecomComponent, canActivate: [AuthGuard] },
      { path: 'update', component: SaleWithTelecomComponent, canActivate: [AuthGuard] },
      { path: 'view', component: SaleWithTelecomComponent, canActivate: [AuthGuard] },
    ]
  },
  {
    path: 'sales/itinerant', component: AppLayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: TicketComponent, canActivate: [AuthGuard], data: { ticketType: TICKET_TYPE.SALE_ITINERANT, reuse: true } },
      { path: 'create', component: SaleItinerantComponent, canActivate: [AuthGuard] },
      { path: 'update', component: SaleItinerantComponent, canActivate: [AuthGuard] },
      { path: 'view', component: SaleItinerantComponent, canActivate: [AuthGuard] },
    ]
  },
  {
    path: 'sales/service', component: AppLayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: TicketComponent, canActivate: [AuthGuard], data: { ticketType: TICKET_TYPE.SALE_SERVICE, reuse: true } },
      { path: 'create', component: SaleServiceComponent, canActivate: [AuthGuard] },
      { path: 'update', component: SaleServiceComponent, canActivate: [AuthGuard] },
      { path: 'view', component: SaleServiceComponent, canActivate: [AuthGuard] },
    ]
  },
  {
    path: 'sales/return', component: AppLayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: TicketComponent, canActivate: [AuthGuard], data: { ticketType: TICKET_TYPE.SALE_RETURN, reuse: true } },
      { path: 'create', component: SaleReturnComponent, canActivate: [AuthGuard] },
      { path: 'update', component: SaleReturnComponent, canActivate: [AuthGuard] },
      { path: 'view', component: SaleReturnComponent, canActivate: [AuthGuard] },
    ]
  },
  {
    path: 'sales/return-online', component: AppLayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: TicketComponent, canActivate: [AuthGuard], data: { ticketType: TICKET_TYPE.SALE_RETURN_ONLINE, reuse: true } },
      { path: 'create', component: SaleReturnOnlineComponent, canActivate: [AuthGuard] },
      { path: 'update', component: SaleReturnOnlineComponent, canActivate: [AuthGuard] },
      { path: 'view', component: SaleReturnOnlineComponent, canActivate: [AuthGuard] },
    ]
  },
  {
    path: 'sales/return-service', component: AppLayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: TicketComponent, canActivate: [AuthGuard], data: { ticketType: TICKET_TYPE.SALE_RETURN_SERVICE, reuse: true } },
      { path: 'create', component: SaleReturnServiceComponent, canActivate: [AuthGuard] },
      { path: 'update', component: SaleReturnServiceComponent, canActivate: [AuthGuard] },
      { path: 'view', component: SaleReturnServiceComponent, canActivate: [AuthGuard] },
    ]
  },
  {
    path: 'sales/change', component: AppLayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: TicketComponent, canActivate: [AuthGuard], data: { ticketType: TICKET_TYPE.SALE_CHANGE, reuse: true } },
      { path: 'create', component: SaleChangeComponent, canActivate: [AuthGuard] },
      { path: 'update', component: SaleChangeComponent, canActivate: [AuthGuard] },
      { path: 'view', component: SaleChangeComponent, canActivate: [AuthGuard] },
    ]
  },
  {
    path: 'sales/gift-repay', component: AppLayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: TicketComponent, canActivate: [AuthGuard], data: { ticketType: TICKET_TYPE.SALE_GIFT_REPAY, reuse: true } },
      { path: 'create', component: SaleGiftRepayComponent, canActivate: [AuthGuard] },
      { path: 'update', component: SaleGiftRepayComponent, canActivate: [AuthGuard] },
      { path: 'view', component: SaleGiftRepayComponent, canActivate: [AuthGuard] },
    ]
  },
  {
    path: 'sales/repurchase', component: AppLayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: TicketComponent, canActivate: [AuthGuard], data: { ticketType: TICKET_TYPE.SALE_REPURCHASE, reuse: true } },
      { path: 'create', component: SaleRepurchaseComponent, canActivate: [AuthGuard] },
      { path: 'update', component: SaleRepurchaseComponent, canActivate: [AuthGuard] },
      { path: 'view', component: SaleRepurchaseComponent, canActivate: [AuthGuard] },
    ]
  },
  {
    path: 'sales/repurchase-service', component: AppLayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: TicketComponent, canActivate: [AuthGuard], data: { ticketType: TICKET_TYPE.SALE_REPURCHASE_SERVICE, reuse: true } },
      { path: 'create', component: SaleRepurchaseServiceComponent, canActivate: [AuthGuard] },
      { path: 'update', component: SaleRepurchaseServiceComponent, canActivate: [AuthGuard] },
      { path: 'view', component: SaleRepurchaseServiceComponent, canActivate: [AuthGuard] },
    ]
  },
  {
    path: 'sales/renew', component: AppLayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: TicketComponent, canActivate: [AuthGuard], data: { ticketType: TICKET_TYPE.SALE_RENEW, reuse: true } },
      { path: 'create', component: SaleRenewComponent, canActivate: [AuthGuard] },
      { path: 'update', component: SaleRenewComponent, canActivate: [AuthGuard] },
      { path: 'view', component: SaleRenewComponent, canActivate: [AuthGuard] },
    ]
  },
  {
    path: 'voucher/compensation', component: AppLayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: TicketComponent, canActivate: [AuthGuard], data: { ticketType: TICKET_TYPE.STOCK_COMPENSATION, reuse: true } },
      { path: 'create', component: VoucherCompensationComponent, canActivate: [AuthGuard] },
      { path: 'update', component: VoucherCompensationComponent, canActivate: [AuthGuard] },
      { path: 'view', component: VoucherCompensationComponent, canActivate: [AuthGuard] },
    ]
  },
  {
    path: 'voucher/service-compensation', component: AppLayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: TicketComponent, canActivate: [AuthGuard], data: { ticketType: TICKET_TYPE.SERVICE_COMPENSATION, reuse: true } },
      { path: 'create', component: ServiceCompensationComponent, canActivate: [AuthGuard] },
      { path: 'update', component: ServiceCompensationComponent, canActivate: [AuthGuard] },
      { path: 'view', component: ServiceCompensationComponent, canActivate: [AuthGuard] },
    ]
  },
  //Edit
  {
    path: 'voucher/other-money-transfer', component: AppLayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: TicketComponent, canActivate: [AuthGuard], data: { ticketType: TICKET_TYPE.TRANSFER_SHIFT_PAYMENT, reuse: true } },
      { path: 'create', component: OtherMoneyTransferDetailComponent, canActivate: [AuthGuard] },
      { path: 'update', component: OtherMoneyTransferDetailComponent, canActivate: [AuthGuard] },
      { path: 'view', component: OtherMoneyTransferDetailComponent, canActivate: [AuthGuard] },
    ]
  },
  {
    path: 'firebase-messaging-sw.js',
    loadChildren: () =>
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('../firebase-messaging-sw.js').then((m: any) => m.default),
  },
  // {
  //   path: 'report', component: AppLayoutComponent, canActivate: [AuthGuard],
  //   children: [
  //     { path: '', component: CategoryComponent, canActivate: [AuthGuard] },
  //   ]
  // },
];

const otherwise = { path: '**', redirectTo: '' };
const fullRoute = [...routes, ...getRouteCategoryNotExists(routes), ...getRouteReportNotExists(routes), ...[otherwise]];

@NgModule({
  imports: [RouterModule.forRoot(fullRoute)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
