
import { Injectable } from '@angular/core';
import { Guarantee, GuaranteeRequest } from '@app/sales-management/model/ticket/common-model/guarantee.model';
import { CommonService } from './common.service';


@Injectable({
    providedIn: 'root'
})
export class GuanranteeService {
    constructor(private commonService: CommonService) { }

    addNew(ma_imei: string, src: Guarantee[], des: Guarantee[]) {
        const rs = src.map((e: any, i: number) => {
            e.ma_imei = ma_imei;
            e.line_nbr = i;
            return e;
        });
        des.push(...rs);
    }

    addNewGuaranteeNew(ma_vt: string, ma_imei: string, src: any, des: Guarantee[]) {
        const guaranteeNew = new Guarantee();
        Object.keys(guaranteeNew).forEach(key => {
            if (src.hasOwnProperty(key)) {
                (guaranteeNew as any)[key] = src[key];
            }
        });
        guaranteeNew.ma_vt = ma_vt;
        guaranteeNew.ma_imei = ma_imei;
        guaranteeNew.hang_sx = src?.nh_vt || '';
        const exists = des.find(x => (x.ma_vt === ma_vt) && (x.ma_imei === ma_imei));
        !exists && des.push(guaranteeNew);
    }

    convertGuanranteeToRequest = (guarantees: any, masterInfo: any) => {
        const result = guarantees.map((guarantee: any) => {
            const rs = new GuaranteeRequest();
            Object.keys(rs).map((key: string) => {
                if (guarantee.hasOwnProperty(key)) {
                    (rs as any)[key] = guarantee[key];
                }
            });
            return rs;
        });

        this.commonService.updateBaseInfo(masterInfo, result);
        return result;
    };

    removeGuarantee(ma_imei: string, ticket: any) {
        const count = ticket.merchandise.filter((mer: any) => mer.ma_imei === ma_imei).length;
        if (count <= 1) {
            ticket.guarantee = ticket.guarantee.filter((x: Guarantee) => x.ma_imei !== ma_imei);
        }
    }

    removeGuaranteeOfRenew(ma_imei: string, ticket: any, merchandise: any) {
        const count = merchandise.filter((mer: any) => mer.ma_imei === ma_imei).length;
        if (count <= 1) {
            ticket.guarantee = ticket.guarantee.filter((x: Guarantee) => x.ma_imei !== ma_imei);
        }
    }
}









