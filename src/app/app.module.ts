import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { AlertModule } from './_components/_alert';
import { HotkeyModule } from 'angular2-hotkeys';
import { LoginComponent } from './login';
import { AppLayoutComponent } from './app-layout.component';
import { JwtInterceptor, ErrorInterceptor, CustomRouteReuseStrategy } from './_helpers';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { GridModule } from './_components/grid/grid.module';
import { CustomerModule } from './_components/category/customer/customer.module';
import { ControlsModule } from './_components/controls/controls.module';
import { VoucherModule } from './_components/voucher/voucher.module';
import { SharedModule } from './_components/_shared/shared.module';
import { GridV2Module } from './_components/gridV2/gridV2.module';
import { SearchDialogModule } from './sales-management/component/search/serach-dialog.module';
import { ServiceForImeiModule } from './sales-management/component/merchandise-service/service-for-imei/service-for-imei.module';
import { DiscountSelectModule } from './sales-management/component/discount/select/discount-select.module';
import { LookupV2Component } from './_components/lookupV2/lookup-v2.component';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '@environments/environment';
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';
import { MessagingService } from './_services/message.service';
import { PushNotificationModule } from './_components/_notification/push-notification/push-notification.module';
import { TestModule } from './test/test.module';
import { Home2Component } from './test/home/home.component';
import { ScanComponent } from './test/scan/scan.component';
import { ScanSingleComponent } from './test/scan-single/scan-single.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ServiceOrderModule } from './sales-management/component/merchandise-service/service-order/service-order.module';
import { ChangepassComponent } from './pages/changepass/changepass.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SettingModule } from './pages/setting/setting.module';
import { SettingChangeModule } from './pages/setting/setting-change/setting-change.module';
import { RouteReuseStrategy } from '@angular/router';
import { SelectSearchComponent } from './sales-management/component/form-control-custom/select-search/select-search.component';
// import { CustomRouteReuseStrategy } from './custom-route-reuse';
import { PromotionSelectModule } from './sales-management/component/promotion/promotion-select.module';

import { SearchV2DialogModule } from './sales-management/component/search-v2/serach-v2-dialog.module';
import { CrmDialogComponent } from './sales-management/component/crm/crm-dialog/crm-dialog.component';
import { CrmDialogModule } from './sales-management/component/crm/crm-dialog/crm-dialog.module';
import { CRMSelectModule } from './sales-management/component/crm/crm-select/crm-select.module';
import { SwapImeiDialogModule } from './sales-management/component/tool-swapimei-dialog/swapimei-dialog.module';


@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AlertModule,
    AppRoutingModule,
    FormsModule,
    FontAwesomeModule,
    HotkeyModule.forRoot(),
    BrowserAnimationsModule,
    MaterialModule,
    GridModule,
    GridV2Module,
    CustomerModule,
    ControlsModule,
    VoucherModule,
    SharedModule,
    //
    SearchDialogModule,
    ServiceForImeiModule,
    ServiceOrderModule,
    DiscountSelectModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireMessagingModule,
    PushNotificationModule,
    TestModule,
    DragDropModule,
    MatDialogModule,
    SettingModule,
    SettingChangeModule,
    PromotionSelectModule,
    SearchV2DialogModule,
    CrmDialogModule,
    CRMSelectModule,
    SwapImeiDialogModule
  ],
  declarations: [AppComponent, LoginComponent, AppLayoutComponent, LookupV2Component, Home2Component,
    ScanComponent,
    ScanSingleComponent,
    ChangepassComponent,
    SelectSearchComponent
  ],
  providers: [
    MessagingService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
