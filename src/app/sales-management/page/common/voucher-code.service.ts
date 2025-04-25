import { Injectable } from "@angular/core";
import { VoucherCode, VoucherCodeRequest } from "@app/sales-management/model/ticket/common-model/voucher-code.model";
import { CommonService } from "./common.service";

@Injectable({
    providedIn: 'root'
})
export class VoucherCodeService {
    constructor(private commonService: CommonService) { }

    addNew(voucherCode: any, merchandises: any[], TCreator: { new(): any; }) {
        const isDuplicate = merchandises.some(item =>
            item.ma_vt.trim().toLowerCase() === voucherCode.ma_vt.trim().toLowerCase() &&
            item.ma_imei.trim().toLowerCase() === voucherCode.ma_imei.trim().toLowerCase() &&
            item.ma_voucher.trim().toLowerCase() === voucherCode.ma_voucher.trim().toLowerCase()
        );
        if (isDuplicate) return;
        const voucherCodeNew = this.createNewVoucherCode(voucherCode, TCreator);
        voucherCodeNew.line_nbr = merchandises.length + 1;
        merchandises.push(voucherCodeNew);
    }

    createNewVoucherCode(voucherCode: any, TCreator: { new(): any; }) {
        const voucherCodeNew = new TCreator();
        Object.keys(voucherCodeNew).forEach(key => {
            if (voucherCode.hasOwnProperty(key)) {
                voucherCodeNew[key] = voucherCode[key];
            }
        });
        return voucherCodeNew;
    }

    convertVoucherCodeToRequest = (voucherCodes: any, masterInfo: any) => {
        const result = voucherCodes.map((voucherCode: any) => {
            const newVoucherCode = new VoucherCodeRequest();
            Object.keys(newVoucherCode).map((key: string) => {
                if (voucherCode.hasOwnProperty(key)) {
                    (newVoucherCode as any)[key] = voucherCode[key];
                }
            });
            newVoucherCode.tien_ck_nt = newVoucherCode.tien_ck
            return newVoucherCode;
        }).flat(Infinity);

        this.commonService.updateBaseInfo(masterInfo, result);
        return result;
    };

    convertFromVoucher(src: any[], des: any[], TCreator?: { new(): any; }) {
        const rs = src.map((e: any, i: number) => {
            let voucherCodeNew = new VoucherCode();
            if (TCreator) {
                voucherCodeNew = new TCreator();
            }
            Object.keys(voucherCodeNew).map((key: string) => {
                if (e.hasOwnProperty(key)) {
                    (voucherCodeNew as any)[key] = e[key];
                }
            });
            voucherCodeNew.line_nbr = i;
            return voucherCodeNew;
        });
        rs.map((e, i) => { e.line_nbr = i; });
        des.push(...rs);
    }

    validVoucherCode(ticket: any) {
        let message = '';

        // kiểm tra ma_kh
        if (!ticket.masterInfo.ma_kh) {
            message = 'Chưa nhập mã khách hàng';
            return message;
        }
        // ktra nếu chưa nhập hàng hóa
        const merchandise = ticket.merchandise ?? ticket.merchandise_new_sale;
        if (!merchandise.length) {
            message = 'Chưa nhập hàng hóa';
            return message;
        }

        return message;
    }

    resetVoucherCode(ticket: any) {
        ticket.voucherCode = [];
    }

    validateVoucherResponse(response: any, skus: string[], ticket: any) {
        if (!response?.IsValid) {
            this.commonService.showMessage(response?.Message || 'Mã giảm giá không hợp lệ');
            return null;
        }

        const phone = ticket.masterInfo.ma_kh?.trim();
        if (response?.Config?.Phone?.IsEnable) {
            const phones = (response?.Config?.Phone?.Items || []).map((item: string) => item.trim());
            if (!phones.includes(phone)) {
                this.commonService.showMessage('Mã giảm giá không áp dụng cho khách hàng này');
                return null;
            }
        }

        if (response?.LimitConfig) {
            const config = response.LimitConfig;
            if (config.IsUsing && !config.IsAllowMutil) {
                this.commonService.showMessage('Mã giảm giá đã được sử dụng');
                return null;
            }
            if (config.AvailableQuantity <= 0) {
                this.commonService.showMessage('Mã giảm giá đã hết lượt sử dụng');
                return null;
            }
            if (!config.IsAllowUse) {
                this.commonService.showMessage('Mã giảm giá không hợp lệ hoặc đã bị khóa');
                return null;
            }
        }

        const userJson = localStorage.getItem('user');
        const userObj = userJson !== null && JSON.parse(userJson);
        const stock = userObj['shop'] || '';
        if (response?.Config?.Stock?.IsEnable) {
            const stocks = (response?.Config?.Stock?.Items || []).map((item: string) => item.trim());
            if (!stocks.includes(stock)) {
                this.commonService.showMessage('Mã giảm giá không áp dụng cho cửa hàng hiện tại');
                return null;
            }
        }

        const member = ticket.masterInfo.ma_hang.trim() || '';
        if (response?.Config?.Member?.IsEnable) {
            const Members = (response?.Config?.Member?.Items || []).map((item: string) => item.trim());
            if (!Members.includes(member)) {
                this.commonService.showMessage('Mã giảm giá không áp dụng cho hạng thành viên hiện tại');
                return null;
            }
        }

        if (response?.Config?.SKU?.IsEnable) {
            const validSkus = (response?.Config?.SKU?.Items || []).map((item: string) => item.trim().toLowerCase());
            if (!skus.some(sku => validSkus.includes(sku))) {
                this.commonService.showMessage('Mã giảm giá không áp dụng cho mã hàng này');
                return null;
            }
            return validSkus;
        }

        return [];
    }
}
