import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { DELIVERY_TYPE, Transport } from '@app/sales-management/model/common/delivery.mode';
import { TransportRequest } from '@app/sales-management/model/ticket/sale-online/request.model';


@Injectable({
    providedIn: 'root'
})
export class TransportService {
    constructor(private commonService: CommonService) { }

    convertFromVoucher(src: TransportRequest) {
        const result = new Transport;

        if (src) {
            result.ma_loaivc = src.ma_loaivc.trim();
            result.cod = {
                ma_van_don: src.ma_van_don,
                so_dh_vc: src.so_dh_vc,
                tien_phi_cod: src.tien_phi_cod
            };
            result.hhDelivery = {
                ma_nv_giao: src.ma_nv_giao,
                ghi_chu_gh: src.ghi_chu_gh,
                ten_nv: ''
            };
        }

        return result;
    }

    convertToRequest(src: Transport, masterInfo: any) {
        let result = new TransportRequest;
        switch (src.ma_loaivc) {
            case DELIVERY_TYPE.COD:
                result = { ...result, ...src.cod };
                break;
            case DELIVERY_TYPE.HH:
                result = { ...result, ...src.hhDelivery };
                break;
            case DELIVERY_TYPE.CH:
                break;
            default:
                break;
        }

        result.ma_loaivc = src.ma_loaivc;

        this.commonService.updateBaseInfo(masterInfo, [result]);
        return result;
    }
}




