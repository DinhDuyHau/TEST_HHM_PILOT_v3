import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DiscountApiService } from '@app/sales-management/api/discount-api.service';
import { ImeiApiService } from '@app/sales-management/api/imei-api.service';
import { MerchandiseApiService } from '@app/sales-management/api/merchandise-api.service';
import { Discount } from '@app/sales-management/model/ticket/common-model/discount.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Payment } from '@app/sales-management/model/ticket/common-model/payment.model';
import { ImeisManagerService } from './imeisManager.service';
import { NavigationEnd, NavigationStart, Router, Scroll } from '@angular/router';
import { filter, fromEvent } from 'rxjs';
import { Language } from './language';
import { TicketApiService } from '@app/sales-management/api/ticket-api.service';
import { formatDate } from '@angular/common';
import dataFormat from '@app/_common/dataFormat';
import { environment } from '@environments/environment';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { LookupComponent } from '@app/_components/lookup/lookup.component';
import { Option } from '@app/sales-management/model/ticket/common-model/option.model';
import { getDateFormat } from '@app/_common/commonFunction';

@Injectable({
    providedIn: 'root',
})
export class CommonService {
    MESSAGE_TYPE = {
        SUCCESS: 1,
        ERROR: 2
    };
    needCalcDiscount = true;
    discounts: Discount[] = [];
    constructor(
        private router: Router,
        public snackBar: MatSnackBar,
        public dialog: MatDialog,
        private breakpointObserver: BreakpointObserver,
        public merchandiseApiService: MerchandiseApiService,
        public imeiApiService: ImeiApiService,
        public discountApiService: DiscountApiService,
        private imeisManagerService: ImeisManagerService,
        private language: Language,
        private ticketApiService: TicketApiService
    ) {
        const isMobile = () => {
            const arr = ['windows'];
            for (const item in arr) {
                const rs = navigator.userAgent.toLowerCase().match(item);
                if (rs) {
                    return false;
                } else {
                    console.log(navigator.userAgent);
                }
            }
            return true;
        };

        // const resetImeiState = () => {
        //     imeisManagerService.resetImeisState();
        //     imeisManagerService.resetImeisStateOfVoucher();
        // };

        // window.onbeforeunload = function (e) {
        //     resetImeiState();
        // };

        // const loadEvent = fromEvent(window, 'load');
        // loadEvent.subscribe(event => {
        //     resetImeiState();
        // });

        // // const visibilityChangeEvent = fromEvent(window, 'visibilitychange');
        // // visibilityChangeEvent.subscribe(event => {
        // //     if (isMobile()) {
        // //         switch (document.visibilityState) {
        // //             case "hidden":
        // //                 resetImeiState();
        // //                 break;
        // //             case "visible":
        // //                 location.reload();
        // //                 break;
        // //             default:
        // //                 break;
        // //         }
        // //     }
        // // })

        // router.events.pipe(
        //     filter(event => event instanceof NavigationEnd)
        // ).subscribe((event: any) => {
        //     resetImeiState();
        // });
    }

    // #region imei state
    resetImeiState() {
        this.imeisManagerService.resetImeisState();
    }

    addImeiToStorage(imei: string) {
        this.imeisManagerService.addImei(imei);
    }

    addToImeisInVoucher(imeis: string[]) {
        //this.imeisManagerService.addToImeisInVoucher(imeis);
    }

    removeImeiFromStorage(imei: string) {
        this.imeisManagerService.removeImei(imei);
    }

    clearImeiStorage() {
        this.imeisManagerService.clear();
    }

    // #endregion imei state

    showMessage(message: string, ...args: any[]) {
        const messageClose = this.language.getMessage('btnClose');
        let isMobile = false;
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe((result) => {
            isMobile = result.matches;
        });
        if (isMobile) {
            this.snackBar.open(message, messageClose, {
                duration: 5000,
                verticalPosition: 'top'
            });
        }
        else {
            this.snackBar.open(message, messageClose, {
                duration: 5000,
            });
        }
    }

    showMessageByName(messageName: string, ...args: any[]) {
        const message = messageName && this.language.getMessage(messageName, ...args);
        if (!message) {
            this.ticketApiService.addNewResource({
                name: messageName,
                message: `chưa có message: ${messageName}`,
                message2: `chưa có message2: ${messageName}`
            });
            this.showMessage('Không tìm thấy message trong resources');
        }
        this.showMessage(message);
    }
    showMessageByNameAdvance(messageName: string, ...args: any[]) {
        const message = messageName && this.language.getMessageAdvance(messageName, ...args);
        if (!message) {
            this.ticketApiService.addNewResource({
                name: messageName,
                message: `chưa có message: ${messageName}`,
                message2: `chưa có message2: ${messageName}`
            });
            this.showMessage('Không tìm thấy message trong resources');
        }
        this.showMessage(message);
    }
    getMessageAdvance(messageName: string, ...args: any[]) {
        return this.language.getMessageAdvance(messageName, ...args);
    }
    getMessage(messageName: string, ...args: any[]) {
        return this.language.getMessage(messageName, ...args);
    }
    showMessageByContent(messageContent: string, ...args: any[]) {
        const message = messageContent && this.language.prepareMessage(messageContent, ...args);
        if (!message)
            this.showMessage('Không tìm thấy message trong resources');
        this.showMessage(message);
    }

    createObserver(next: any, error?: any, complete?: any) {
        return {
            next,
            error,
            complete
        };
    }

    openDialog(component: ComponentType<any>, data?: any, classScreen?: string, disableClose = true, maxWidth?: string) {
        if (window.innerWidth <= 800 && !maxWidth) {
            maxWidth = '100';
        }
        return this.dialog.open(component, { data, disableClose: disableClose, panelClass: classScreen || '', maxWidth: maxWidth || '' });
    }

    focusControl(tabIndex: number) {
        // console.log(document.querySelector(`input[tabindex='${tabIndex}']`));

        (document.querySelector(`input[tabindex='${tabIndex}']`) as HTMLElement)?.focus();
    }

    clearText(tabIndexs: number[]) {
        tabIndexs.forEach(e => {
            (document.querySelector(`input[tabindex='${e}']`) as HTMLInputElement).value = '';
        });
    }

    focusControl2(id: any) {
        (document.querySelector(`input[id='${id}']`) as HTMLElement)?.focus();
    }

    clearText2(tabIndexs: any[]) {
        tabIndexs.forEach(e => {
            const inputElement = document.querySelector(`input[id='${e}']`) as HTMLInputElement;
            if (inputElement) {
                inputElement.value = '';
            }
        });
    }

    updateBaseInfo = (masterInfo: any, model: any[]) => {
        model.forEach(e => {
            e.stt_rec = masterInfo.stt_rec;
            e.stt_rec0 = masterInfo.stt_rec0;
            e.ma_ct = masterInfo.ma_ct;
            e.ngay_ct = masterInfo.ngay_ct;
            e.ma_cuahang = masterInfo.ma_cuahang;
            e.so_ct = masterInfo.so_ct;
            e.ma_ca = masterInfo.ma_ca;
            e.ma_nvbh_i = masterInfo.ma_nvbh;
            e.ma_dvcs = masterInfo.ma_dvcs;

            e.tien_phi_01 = masterInfo.tien_phi_01;
            e.tien_phi_02 = masterInfo.tien_phi_02;
            e.tien_phi_03 = masterInfo.tien_phi_03;
            e.tien_phi_04 = masterInfo.tien_phi_04;
            e.tien_phi_05 = masterInfo.tien_phi_05;
            e.tien_phi_06 = masterInfo.tien_phi_06;
            e.tien_phi_07 = masterInfo.tien_phi_07;
            e.tien_phi_08 = masterInfo.tien_phi_08;
            e.tien_phi_09 = masterInfo.tien_phi_09;
            e.tien_phi_10 = masterInfo.tien_phi_10;
            e.phi_hoang_ha = masterInfo.phi_hoang_ha;

        });

        return model;
    };

    // #region convert
    convertMasterInfo = (masterInfo: any, TCreator: { new(): any; }) => {
        const masterInfoNew = new TCreator();
        Object.keys(masterInfoNew).forEach(key => {
            if (masterInfo.hasOwnProperty(key)) {
                masterInfoNew[key] = masterInfo[key];
            }
        });

        masterInfoNew.t_ck_nt = masterInfoNew.t_ck;
        masterInfoNew.t_tien = masterInfoNew.t_tien_nt2;
        masterInfoNew.t_tien_nt = masterInfoNew.t_tien_nt2;
        masterInfoNew.t_tien2 = masterInfoNew.t_tien_nt2;
        masterInfoNew.t_thue = masterInfoNew.t_thue_nt;
        masterInfoNew.t_tt = masterInfoNew.t_tt_nt;
        masterInfoNew.t_gg_nt = masterInfoNew.t_gg;
        masterInfoNew.t_cp_khac_nt = masterInfoNew.t_cp_khac;
        masterInfoNew.ngay_ct = getDateFormat(new Date(masterInfoNew.ngay_ct));
        masterInfoNew.ngay_lct = masterInfoNew.ngay_ct;
        masterInfoNew.s4 = masterInfoNew.t_tien_ban;

        Object.keys(masterInfoNew).forEach(key => {
            if (masterInfoNew[key] === undefined) {
                delete masterInfoNew[key];
            }
        });

        return masterInfoNew;
    };

    convertMasterInfoFromVoucher = (masterInfo: any, TCreator: { new(): any; }) => {
        const masterInfoNew = new TCreator();
        Object.keys(masterInfoNew).forEach(key => {
            if (masterInfo.hasOwnProperty(key)) {
                masterInfoNew[key] = masterInfo[key];
            }
        });
        return masterInfoNew;
    };

    convertDateOfModelToRequest(model: any, masterInfo: any) {
        const result = { ...model } as any;
        Object.keys(result).forEach(key => {
            const isDate = isNaN(model[key]) && !isNaN(Date.parse(model[key]));
            if (isDate) {
                result[key] = new Date(model[key]).toISOString();
            }
        });

        this.updateBaseInfo(masterInfo, [result]);
        return result;
    }

    convertDateOfModelFromVoucher(model: any) {
        const result = { ...model } as any;
        Object.keys(result).forEach(key => {
            const isDate = isNaN(model[key]) && !isNaN(Date.parse(model[key]));
            if (isDate) {
                result[key] = formatDate(new Date(model[key]), 'yyyy-MM-dd', 'en_US');
            }
        });
        return result;
    }

    // File Contract
    convertFileFromObject(file: any) {
        const form_data = new FormData();
        for (const key in file) {
            form_data.append(key, file[key]);
        }
        return form_data;
    }

    convertBase64JPEGtoPNG(base64JPEG: string) {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            const image = new Image();

            if (context) {
                image.onload = function () {
                    canvas.width = image.width;
                    canvas.height = image.height;
                    context.drawImage(image, 0, 0);

                    try {
                        canvas.toBlob(function (blob: any) {
                            const reader = new FileReader();
                            reader.onloadend = function () {
                                resolve(reader.result);
                            };
                            reader.onerror = reject;
                            reader.readAsDataURL(blob);
                        }, 'image/png');
                    } catch (error) {
                        reject(error);
                    }
                };

                image.onerror = reject;
                image.src = base64JPEG;
            }
        });
    }


    convertBase64PNGtoFile(base64PNG: string, filename: string) {
        const byteCharacters = atob(base64PNG.split(',')[1]);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
            const slice = byteCharacters.slice(offset, offset + 1024);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, { type: 'image/png' });
        const file = new File([blob], filename, { type: 'image/png' });

        return file;
    }


    // Convert Base64 to file
    async getFileFromBase64(base64: string, fileName: string) {
        try {
            const base64PNG = await this.convertBase64JPEGtoPNG(base64);
            if (base64PNG && typeof base64PNG === 'string') {
                return this.convertBase64PNGtoFile(base64PNG, fileName);

            } else {
                return undefined;
            }
        } catch (error) {
            console.error(error);
            return undefined;
        }

    }

    // #endregion convert

    // #region validate
    hasNegativeValue(data: any) {
        for (const key in data) {
            if (typeof data[key] === 'number' && data[key] < 0) {
                return true;
            }
        }
        return false;
    }

    isInValidPayment(payment: Payment) {
        return false;
        // if (payment.tien_mat.selected &&
        //     payment.tien_mat.tien <= 0
        // ) {
        //     return true;
        // }
        // else if (payment.chuyen_khoan &&
        //     payment.chuyen_khoan.selected &&
        //     (payment.chuyen_khoan.tien <= 0 ||
        //         !payment.chuyen_khoan.tk_nh_nhan)) {
        //     return true;
        // }
        // else if (payment.quet_the &&
        //     payment.quet_the.selected &&
        //     (payment.quet_the.tien <= 0 ||
        //         !payment.quet_the.so_the ||
        //         !payment.quet_the.ma_chuan_chi ||
        //         !payment.quet_the.ma_may_pos)) {
        //     return true;
        // }
        // else if (payment.tra_gop &&
        //     payment.tra_gop.selected &&
        //     (!payment.tra_gop.tien ||
        //         !payment.tra_gop.so_hd_tragop ||
        //         !payment.tra_gop.ma_dv_tragop ||
        //         payment.tra_gop.phi_bao_hiem <= 0)) {
        //     return true;
        // }
        // else if (payment.vi_dien_tu &&
        //     payment.vi_dien_tu.selected &&
        //     (payment.vi_dien_tu.tien <= 0 ||
        //         !payment.vi_dien_tu.thong_tin)
        // ) {
        //     return true;
        // }
        // else if (payment.vnpay &&
        //     payment.vnpay.selected &&
        //     (payment.vnpay.tien <= 0 ||
        //         !payment.vnpay.so_hd_vnpay)
        // ) {
        //     return true;
        // }
        // return false;
    }
    // #endregion validate


    // #region rouding monney
    rouding(value: number, option?: Option) {
        if (option) {
            return Math.round(value / option.he_so_lam_tron) * option.he_so_lam_tron;
        }
        return Math.round(value / 1000) * 1000;
    }

    // #endregion rounding money

    getPointRateExchange = (ticket: any, option?: Option) => {
        this.ticketApiService.getSaleOptions().subscribe((result: any) => {
            if (result && result.success) {
                const res = result.result;
                ticket.masterInfo.he_so_qd = Number.parseInt(res['m_point_rate_exchange']);
                ticket.masterInfo.he_so_qd_tien = Number.parseInt(res['m_exchange_reverse']);
                if (option) {
                    option.he_so_qd = ticket.masterInfo.he_so_qd;
                    option.he_so_qd_tien = ticket.masterInfo.he_so_qd_tien;
                    option.he_so_lam_tron = Number.parseInt(res['m_round_price']);
                }
            }
            else {
                this.showMessageByName('Runtime_err');
            }
        });
        // this.ticketApiService.getPointRateExchange().subscribe((result: any) => {
        //     ticket.masterInfo.he_so_qd = result.result.val;
        // });
        // this.ticketApiService.getPointRateExchangeReverse().subscribe((result: any) => {
        //     ticket.masterInfo.he_so_qd_tien = result.result.val;
        // });
    };

    calcPointRateExchange = (ticket: any) => {
        return Math.round(ticket.masterInfo.t_tt_nt / ticket.masterInfo.he_so_qd) || 0;
    };

    calcExchangeMoney = (diem_qd: number, he_so_qd: number) => {
        return Math.round(diem_qd * he_so_qd);
    };
    sendEmailService(stt_rec: string) {
        return this.ticketApiService.sendEmailService(stt_rec);
    }

    getCustomerInfoByTax(ma_so_thue: string) {
        return this.ticketApiService.get(environment.apiUrl + '/customer/get_infomation_by_tax', { ma_so_thue });
    }

    getDiscountCodeInfo(ma_gg: string) {
        return this.ticketApiService.get(environment.apiUrl + '/discountcode/get_discount_code_info', { ma_gg });
    }
    getRenewPrice(ma_vt: string, ma_cuahang: string, ma_ncc: string) {
        return this.ticketApiService.getRenewPrice(ma_vt, ma_cuahang, ma_ncc);
    }
    getDiscDiscountProgramCRM(list_item: any[]) {
        return this.ticketApiService.post(environment.apiUrl + '/discountcode/get_discount_program', list_item);
    }
    openLookup(control: any, multipleChoose = false) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = '100%';
        if (window.innerWidth < 768) {
            dialogConfig.maxWidth = '100';
        }
        dialogConfig.disableClose = true;
        dialogConfig.data = {
            service: control,
            multipleChoose: multipleChoose
        };
        const dialogRef = this.dialog.open(LookupComponent, dialogConfig);
        return dialogRef.afterClosed();
    }
}







