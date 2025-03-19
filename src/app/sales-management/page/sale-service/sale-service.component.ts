import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SaleServiceService } from './sale-service.service';
import { ServiceSaleTicket } from '@app/sales-management/model/ticket/sale-service/model';
import dataFormat from '@app/_common/dataFormat';
import { MatDialog } from '@angular/material/dialog';
import { Customer } from '@app/_components/category/customer/customer.model';
import { StatusTicket } from '@app/sales-management/model/common/status.model';
import { SEARCH_COMPONENT_NAME, SearchDialogComponent } from '../../component/search/serach-dialog.component';
import { CustomerCreateDialogComponent } from '../../component/customer/customer-create-dialog/customer-create-dialog.component';
import { CustomerApiService } from '@app/sales-management/api/customer-api.service';
import { Discount } from '@app/sales-management/model/ticket/common-model/discount.model';
import { TicketApiService } from '@app/sales-management/api/ticket-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TICKET_CODE, TICKET_ENTITY } from '@app/sales-management/model/common/ticket-code.model';
import { VoucherDto } from '@app/sales-management/model/ticket/common-model/voucher.dto.model';
import { Service } from '@app/sales-management/model/ticket/sale-service/model';
import { CommonService } from '../common/common.service';
import { MODE } from '@app/sales-management/enum/ticket.enum';
import { CameraComponent } from '@app/sales-management/component/webcam/webcam.component';
import { ViewImageComponent } from '@app/sales-management/component/view-image/view-image.component';
import { Language } from '../common/language';
import { EInvoiceInfo, EInvoiceInfoOutput } from '@app/sales-management/model/dto/einvoice.dto';

const { SERVICE_SELECT_LIST } = require('@assets/fields/grid/sales-fields-table.json');

@Component({
    selector: 'app-sale-service',
    templateUrl: './sale-service.component.html',
    styleUrls: ['./sale-service.component.scss'],
})
export class SaleServiceComponent implements OnInit, AfterViewInit {
    ticket: ServiceSaleTicket = new ServiceSaleTicket;
    statusList: StatusTicket[] = [];
    disableSelectStatus = true;
    readonly = false;
    dataFormat = dataFormat;
    title = '';
    discountCanApply: Discount[] = [];
    uploadImageSuccess = false;
    uploading = true;
    serviceColumns = SERVICE_SELECT_LIST;
    invalid = false;
    submitButtonTitle!: string;
    cancelButtonTitle!: string;
    mode!: number;
    isSaving = false;
    isDisabled = false;
    tabIndex = {
        ma_kh: 'ma_kh',
        ma_dv: 'ma_dv'
    };
    previewImage = '';
    tabIndexFocusFirst = 'ma_kh';
    eInvoiceInfo: EInvoiceInfo = new EInvoiceInfo();
    conversionPoints = 0;
    eInvoiceInfoOutput: EInvoiceInfoOutput = new EInvoiceInfoOutput();
    entity = TICKET_ENTITY.SERVICE;
    action = '';
    shop = '';
    addOrUpdateCustomer = 'create';

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private saleServiceService: SaleServiceService,
        public dialog: MatDialog,
        private customerApiService: CustomerApiService,
        private ticketApiService: TicketApiService,
        private commonService: CommonService,
    ) {
        localStorage.setItem('useGridCached', '1');
        this.saleServiceService.setTicket(this.ticket);
    }

    get tabList() {
        return [
            { label: 'Dịch vụ', count: this.ticket?.service?.length ?? 0 },
            { label: 'HĐĐT' }
        ];
    }

    ngAfterViewInit(): void {
        // this.commonService.focusControl(this.tabIndexFocusFirst);
    }

    ngOnInit() {
        this.route.url.subscribe(urlSegment => {
            const path = urlSegment[0].path;
            if (urlSegment[0].path) {
                switch (path) {
                    case 'create':
                        this.title = Language.content.add_new;
                        this.disableSelectStatus = true;
                        this.mode = MODE.CREATE;
                        this.submitButtonTitle = Language.content.save;
                        this.cancelButtonTitle = Language.content.cancel;
                        this.action = 'create';
                        break;
                    case 'update':
                        this.title = Language.content.edit;
                        this.mode = MODE.UPDATE;
                        this.disableSelectStatus = false;
                        this.submitButtonTitle = Language.content.save;
                        this.cancelButtonTitle = Language.content.cancel;
                        this.action = 'update';
                        break;
                    case 'view':
                        this.readonly = true;
                        this.submitButtonTitle = Language.content.save;
                        this.title = Language.content.view;
                        this.mode = MODE.VIEW;
                        this.cancelButtonTitle = Language.content.exit;
                        break;
                }
            }
        });

        const getStatusList = () => {
            this.ticketApiService.getStatus([{ Name: 'ma_ct', Operator: '=', Value: TICKET_CODE.SERVICE }]).subscribe(result => {
                this.statusList = result.result.items as StatusTicket[];
            });
        };

        this.route.queryParams.subscribe((data: any) => {
            if (data.key) {
                this.disableSelectStatus = false;
                this.ticketApiService.getVoucherByid(TICKET_ENTITY.SERVICE, data.key).subscribe((result) => {
                    if (result.result) {
                        // set cửa hàng để truyền sang payment tab
                        this.shop = (result.result as any).masterInfo.ma_cuahang;

                        const hddtTable = (result.result as any).details.find((item: any) => item.id === 10);
                        if (hddtTable && hddtTable.data && hddtTable.data.length && hddtTable.data[0]) {
                            this.eInvoiceInfo = hddtTable.data[0];
                        }
                        this.saleServiceService.loadData(result.result as any as VoucherDto);
                        getStatusList();
                        this.commonService.getPointRateExchange(this.ticket);
                        this.saleServiceService.getConversionPoint().subscribe(result => {
                            if (result && result.success && result.result !== null) {
                                this.conversionPoints = result.result;
                                // this.ticket.payment.sd_diem.diem_qd = result.result;
                            }
                        });
                        this.tabIndexFocusFirst = this.tabIndex.ma_dv;
                    }
                });
            } else {
                this.disableSelectStatus = true;
                this.saleServiceService.initTicket(this.ticket);
                getStatusList();
                this.commonService.getPointRateExchange(this.ticket);
                this.tabIndexFocusFirst = this.tabIndex.ma_kh;
            }
        });
    }

    // #region customer
    handleAddCustomer(customer: Customer) {
        this.commonService.focusControl2(this.tabIndex.ma_dv);
        this.saleServiceService.setInfoCustomer(customer);
        this.saleServiceService.getConversionPoint().subscribe(result => {
            if (result && result.success && result.result !== null) {
                this.conversionPoints = result.result;
                this.ticket.payment.sd_diem.diem_qd = result.result;
            }
        });
    }



    onEnterCustomerCode(ma_kh: string) {
        this.customerApiService.getOneById(ma_kh).subscribe(result => {
            if (result.success && result.result) {
                const customer: any = result.result;
                this.handleAddCustomer(customer);

                // Kiểm tra điều kiện mở dialog
                if (this.commonService.shouldOpenDialog(customer)) {
                    // mở dialog add khách hàng nhưng ở chế độ update
                    this.addOrUpdateCustomer = 'update';
                    this.openAddCustomerDialog(customer.ma_kh);
                }
            } else {
                this.commonService.showMessageByContent(Language.content.exists_customer_yn_no, ma_kh);
                this.saleServiceService.resetCustomerInfo(this.ticket);
                this.addOrUpdateCustomer = 'create';
                this.openAddCustomerDialog(ma_kh);
            }
        });
    }

    openSearchCustomerDialog() {
        this.commonService.openDialog(SearchDialogComponent,
            { keyword: '', componentName: SEARCH_COMPONENT_NAME.CUSTOMER })
            .afterClosed()
            .subscribe((customer: Customer) => {
                customer && this.handleAddCustomer(customer)

                // Kiểm tra điều kiện mở dialog
                if (this.commonService.shouldOpenDialog(customer)) {
                    // mở dialog add khách hàng nhưng ở chế độ update
                    this.addOrUpdateCustomer = 'update';
                    this.openAddCustomerDialog(customer.ma_kh);
                }
            });
    }

    // click button thêm khách hàng
    openAddCustomerDialog(ma_kh = ''): void {
        this.commonService.openDialog(CustomerCreateDialogComponent, { ma_kh: ma_kh, addOrUpdate: this.addOrUpdateCustomer }, 'fullscreen-dialog')
            .afterClosed()
            .subscribe((customer: Customer) => {
                customer && this.saleServiceService.setInfoCustomer(customer);
            });
    }

    //Upload image
    openUploadImage() {
        this.commonService.openDialog(CameraComponent, {}, 'camera-style').afterClosed().subscribe(result => {
            this.previewImage = result;
        });
    }

    // Open Image
    openImage() {
        if (!this.previewImage) {
            this.commonService.showMessage(Language.content.No_image);
            return;
        }
        this.commonService.openDialog(ViewImageComponent, { imageUrl: this.previewImage }, '', false).afterClosed().subscribe(result => {
            // console.log("result: ", result);
        });
    }

    //#endregion customer

    //#region service
    openSearchServiceDialog() {
        if (this.ticket.masterInfo.ten_kh == '') {
            this.commonService.showMessage('Mã khách hàng không được để trống');
            return;
        }
        this.commonService.openDialog(SearchDialogComponent,
            { keyword: '', componentName: SEARCH_COMPONENT_NAME.SERVICE })
            .afterClosed()
            .subscribe((service: any) => {
                this.handleAddService(service);
                this.commonService.clearText2([this.tabIndex.ma_dv]);
            });
    }

    handleAddService(service: any) {
        const isExist = this.ticket.service.find(e => e.ma_dv === service.ma_dv);
        if (isExist) {
            this.commonService.showMessageByName('lblWarningServiceExist');
        } else {
            this.saleServiceService.setInfoService(service);
        }
    }
    openSaleServiceDialog() {
        this.commonService.openDialog(SearchDialogComponent,
            { keyword: '', componentName: SEARCH_COMPONENT_NAME.SERVICE })
            .afterClosed()
            .subscribe();
    }

    onUpdateService(event: { item: Service }) {
        this.saleServiceService.updateServiceQuantity(event.item);
    }

    // click button add service
    onRemoveService(event: { item: Service }) {
        this.saleServiceService.removeService(event.item, this.ticket);
    }

    onChangeQuantity(event: { item: any, index: number, value: any, columnName: string }) {
        if (+event.value) {
            this.ticket.service[event.index].so_luong = +event.value;
        }
        this.ticket.service[event.index].thanh_tien = this.ticket.service[event.index].gia_ban * event.value;
        this.ticket.service[event.index].tien_thue = Math.round(this.ticket.service[event.index].thanh_tien * this.ticket.service[event.index].thue_suat / 100);
        this.ticket.service[event.index].tong_tien = this.ticket.service[event.index].thanh_tien + this.ticket.service[event.index].tien_thue;
        this.saleServiceService.calcMoney();
    }
    // #endregion service

    // Submit
    onSave() {
        // Check âm tiền nợ
        if (this.ticket.masterInfo.t_con_no < 0) {
            this.commonService.showMessage('Tiền nợ không được âm');
            return;
        }

        const message = this.saleServiceService.validateTicket(this.ticket);
        this.invalid = this.commonService.isInValidPayment(this.ticket.payment) || !this.ticket.masterInfo.ma_kh;

        this.invalid && this.commonService.showMessage(Language.content.Missing_information);
        if (message) {
            this.commonService.showMessage(message);
        } else if (!this.invalid && !message) {
            const voucherDto = this.saleServiceService.prepareVoucher();

            this.route.queryParams.subscribe((data: any) => {
                if (this.mode === MODE.UPDATE && !this.isSaving) {
                    this.isSaving = true;
                    this.isDisabled = true;
                    this.ticketApiService.updateVoucher(TICKET_ENTITY.SERVICE, voucherDto).subscribe(result => {
                        this.isSaving = false;
                        this.isDisabled = false;

                        if (result.success) {
                            this.commonService.showMessage(Language.content.Update_Completed);
                            // if (this.ticket.masterInfo.status == '2') {
                            //     this.commonService.sendEmailService(this.ticket.masterInfo.stt_rec).subscribe((res) => {
                            //         if (res.success) {
                            //             this.commonService.showMessageByName(res.message);
                            //         }
                            //         this.router.navigate(['sales/service']);
                            //     });
                            // }
                            // else {
                            //     this.router.navigate(['sales/service']);
                            // }
                            this.router.navigate(['sales/service']);
                        } else {
                            if (result.result && result.result.length > 0) {
                                this.commonService.showMessageByNameAdvance(result.message, ...result.result);
                            }
                            else {
                                this.commonService.showMessageByName(result.message);
                            }
                        }
                    });
                } else if (this.mode === MODE.CREATE && !this.isSaving) {
                    this.isSaving = true;
                    this.isDisabled = true;
                    this.ticketApiService.addNewVoucher(TICKET_ENTITY.SERVICE, voucherDto).subscribe(result => {
                        this.isSaving = false;
                        this.isDisabled = false;
                        if (result.success) {
                            this.commonService.showMessage(Language.content.Successful_Create);
                            this.router.navigate(['sales/service']);
                        } else {
                            if (result.result && result.result.length > 0) {
                                this.commonService.showMessageByNameAdvance(result.message, ...result.result);
                            }
                            else {
                                this.commonService.showMessageByName(result.message);
                            }
                        }
                    });
                }
            });
        }
    }

    onCancel() {
        this.router.navigate(['sales/service']);
    }
    getLabel(label: string) {
        return this.commonService.getMessage(label);
    }

    onChange_dien_giai(event: any) {
        this.ticket.masterInfo.dien_giai = event;
    }

}
