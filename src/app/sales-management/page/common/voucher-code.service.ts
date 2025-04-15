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
}
