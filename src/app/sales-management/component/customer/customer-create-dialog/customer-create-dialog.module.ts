import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerCreateDialogComponent } from './customer-create-dialog.component';
import { FormInputCustomModule } from '../../form-control-custom/form-input-custom/form-input-custom.module';
import { TabsCustomModule } from '../../form-control-custom/tabs/tabs.module';
import { TabCustomModule } from '../../form-control-custom/tab/tab.module';
import { FormSelectCustomModule } from '../../form-control-custom/form-select-custom/form-select-custom.module';
import { FormSearchSelectCustomModule } from '../../form-control-custom/form-search-select-custom/form-search-select-custom.module';
import { CustomerModule } from '@app/_components/category/customer/customer.module';
@NgModule({
    declarations: [CustomerCreateDialogComponent],
    imports: [
        CommonModule,
        FormInputCustomModule,
        FormSearchSelectCustomModule,
        TabsCustomModule,
        TabCustomModule,
        CustomerModule
    ],
    exports: [CustomerCreateDialogComponent],


})
export class CustomerCreateDialogModule { }
