import { NgModule, createComponent } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContractComponent } from './contract.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { GridModule } from '@app/_components/grid/grid.module';
import { SearchDialogModule } from '../../component/search/serach-dialog.module';
import { PaymentTabModule } from '@app/sales-management/component/payment/payment-tab/payment-tab.module';
import { FormInputCustomModule } from '@app/sales-management/component/form-control-custom/form-input-custom/form-input-custom.module';
import { DataFormatPipeModule } from '@app/_pipe/dataFormat/data-format.pipe';
import { FormSearchSelectCustomModule } from '@app/sales-management/component/form-control-custom/form-search-select-custom/form-search-select-custom.module';
import { FormSelectCustomModule } from '@app/sales-management/component/form-control-custom/form-select-custom/form-select-custom.module';
import { TabsCustomModule } from '@app/sales-management/component/form-control-custom/tabs/tabs.module';
import { TabCustomModule } from '@app/sales-management/component/form-control-custom/tab/tab.module';
import { TableCustomModule } from '../../component/form-control-custom/table-custom/table-custom.module';
import { VoucherInfoModule } from '@app/sales-management/component/form-control-custom/voucher-info/voucher-info.module';

@NgModule({
    declarations: [
        ContractComponent
    ],
    exports: [],
    imports: [
        CommonModule,
        MatIconModule,
        MatTableModule,
        MatTabsModule,
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        DataFormatPipeModule,
        TabsCustomModule,
        TabCustomModule,
        FormsModule,
        GridModule,
        SearchDialogModule,
        PaymentTabModule,
        FormInputCustomModule,
        FormSearchSelectCustomModule,
        FormSelectCustomModule,
        TableCustomModule,
        VoucherInfoModule
    ]
})
export class ContractModule { }