import { Injectable } from '@angular/core';
import { Service, ServiceRequest } from '@app/sales-management/model/ticket/common-model/service.model';
import { CommonService } from './common.service';
import { Discount } from '@app/sales-management/model/ticket/common-model/discount.model';
import { Option } from '@app/sales-management/model/ticket/common-model/option.model';
import { ServiceApiService } from '@app/sales-management/api/service-api.service';


@Injectable({
    providedIn: 'root'
})
export class ServiceOfMerchandiseService {
    constructor(private commonService: CommonService) { }

    addNew(ma_imei: string, src: Service[], des: Service[]) {
        const rs = src.map((e: any, i: number) => {
            const serviceNew = new Service();
            Object.keys(serviceNew).map((key: string) => {
                if (e.hasOwnProperty(key)) {
                    (serviceNew as any)[key] = e[key];
                }
            });
            serviceNew.ma_imei = ma_imei;
            return serviceNew;
        });
        des.push(...rs);
        des.map((e, i) => e.line_nbr = i);
    }

    addNewServiceSale(src: any[], des: any[]) {
        const rs = src.map((e: any, i: number) => {
            const serviceNew = new Service();
            Object.keys(serviceNew).map((key: string) => {
                if (e.hasOwnProperty(key)) {
                    (serviceNew as any)[key] = e[key];
                }
            });
            serviceNew.gia_nhap_mua = e.gia_nhap_mua;
            serviceNew.gia = e.gia;
            serviceNew.so_ct_hd = e.so_ct_hd;
            serviceNew.ngay_ct_hd = e.ngay_ct_hd;
            serviceNew.stt_rec_hd = e.stt_rec_hd;
            serviceNew.stt_rec0hd = e.stt_rec0hd;
            return serviceNew;
        });
        des.push(...rs);
        des.map((e, i) => e.line_nbr = i);
    }

    removeService(item: any, des: any[]) {
        des.splice(item.line_nbr, 1);
        des.map((e, i) => e.line_nbr = i);
    }

    removeServiceAfterRemoveMerchandise(merchandise: any, des: any[]) {
        des.filter(e => e.ma_imei === merchandise.ma_imei).map(service => {
            des.splice(service.line_nbr, 1);
            des.map((e, i) => e.line_nbr = i);
        });
    }

    removePromotionService(service: any, services: any[], merchandises: any[], discounts: Discount[], option: Option) {
        this.removeService(service, services);
        const merchandiseMain = this.getByImeiBuy(service.ma_imei, merchandises);
        if (merchandiseMain) {
            // let option_thue: Option = new Option;
            // option_thue.he_so_lam_tron = 1;
            // option_thue.he_so_qd = 1;
            // option_thue.he_so_qd_tien = 1;

            merchandiseMain.tien_ck_qd += service.tien_kmqd;
            merchandiseMain.tien_ck += service.tien_kmqd;
            // cộng cả tiền ck 09 để trừ
            merchandiseMain.tien_ck += merchandiseMain.tien_ck09;
            merchandiseMain.gia_ck = merchandiseMain.gia_ban - (merchandiseMain.tien_ck / (1 + (merchandiseMain.thue_suat / 100)));
            merchandiseMain.thanh_tien = Math.round(merchandiseMain.gia_ck * merchandiseMain.so_luong);
            // merchandiseMain.tien_thue = this.commonService.rouding(merchandiseMain.thanh_tien * merchandiseMain.thue_suat / 100, option_thue);
            // merchandiseMain.tien_thue = merchandiseMain.thanh_tien * merchandiseMain.thue_suat / 100;
            merchandiseMain.thanh_toan = (merchandiseMain.gia_vat * merchandiseMain.so_luong) - merchandiseMain.tien_ck;
            merchandiseMain.tien_thue = merchandiseMain.thanh_toan - merchandiseMain.thanh_tien;
            const discount = discounts.find(x => {
                return x.ma_imei && service.ma_imei && x.ma_imei.trim() == service.ma_imei.trim();
            });
            if (discount) {
                discount.tien_ck += service.tien_kmqd;
                discount.tien_ck_nt += service.tien_kmqd;
            }
            // trừ tiền ck 09 để tien ck về như cũ
            merchandiseMain.tien_ck -= merchandiseMain.tien_ck09;
            return true;
        }
        return false;
    }
    getByImeiBuy(ma_imei: string, merchandises: any[]): any | undefined {
        return merchandises.find(e => e.ma_imei.trim() === ma_imei.trim());
    }

    convertServiceToRequest = (services: any, masterInfo: any, TCreator: { new(): any; }) => {
        const result = services.map((service: any) => {
            const rs = new TCreator();
            Object.keys(rs).map((key: string) => {
                if (service.hasOwnProperty(key)) {
                    (rs as any)[key] = service[key];
                }
            });
            rs.gia = service.gia_ban;
            rs.gia_nt = service.gia_ban;
            rs.gia2 = service.gia_ban;
            rs.gia_nt2 = service.gia_ban;
            rs.gia_ck = service.gia_ck;
            rs.gia_ck_nt = service.gia_ck;
            rs.ck = service.tien_ck;
            rs.ck_nt = service.tien_ck;
            rs.tien2 = service.thanh_tien;
            rs.tien_nt2 = service.thanh_tien;
            rs.tien = service.thanh_tien;
            rs.tien_nt = service.thanh_tien;
            rs.thue_suat = service.thue_suat;
            rs.thue = service.tien_thue;
            rs.thue_nt = service.tien_thue;
            rs.tt = service.tong_tien;
            rs.tt_nt = service.tong_tien;
            rs.km_yn = service.km_yn ? 1 : 0;
            rs.gia_vat = service.gia_vat;
            rs.gia_vat_nt = service.gia_vat;
            rs.stt_rec0 = service.stt_rec0 || '';
            rs.stt_rec_px = service.stt_rec_px || '';
            rs.stt_rec0px = service.stt_rec0px || '';

            return rs;
        });

        this.commonService.updateBaseInfo(masterInfo, result);
        return result;
    };

    convertFromVoucher(src: any[], des: any[], TCreator?: { new(): any; }) {
        const rs = src.map((e: any, i: number) => {
            let serviceNew = new Service();
            if (TCreator) {
                serviceNew = new TCreator();
            }
            Object.keys(serviceNew).map((key: string) => {
                if (e.hasOwnProperty(key)) {
                    (serviceNew as any)[key] = e[key];
                }
            });
            serviceNew.tien_ck = e.ck;
            serviceNew.gia_ban = e.gia;
            serviceNew.thanh_tien = e.tien2;
            serviceNew.tien_thue = e.thue;
            serviceNew.tong_tien = e.tt;
            serviceNew.key = e.stt_rec_hd + e.stt_rec0hd;
            serviceNew.gia_nhap_mua = e.gia_vat;
            serviceNew.line_nbr = i;
            serviceNew.stt_rec0 = e.stt_rec0 || '';
            return serviceNew;
        });
        rs.map((e, i) => { e.line_nbr = i; });
        des.push(...rs);
    }

    convertReturnServiceFromVoucher(src: any[], des: any[], TCreator: { new(): any; }) {
        const rs = src.map((e: any, i: number) => {
            const serviceNew = new TCreator();
            Object.keys(serviceNew).map((key: string) => {
                if (e.hasOwnProperty(key)) {
                    (serviceNew as any)[key] = e[key];
                }
            });
            serviceNew.so_ct = e.so_ct;
            serviceNew.ngay_ct = e.ngay_ct;
            serviceNew.so_ct_hd1 = e.so_ct;
            serviceNew.ngay_ct_hd1 = e.ngay_ct;
            serviceNew.ngay_ct = e.ngay_ct;
            serviceNew.ma_thue = e.ma_thue;
            serviceNew.stt_rec_hd1 = e.stt_rec;
            serviceNew.stt_rec0hd1 = e.stt_rec0;
            serviceNew.gia_ban = e.gia_ban;
            serviceNew.thanh_tien = e.thanh_tien;
            serviceNew.thue = e.tien_thue;
            serviceNew.tong_tien = e.tong_tien;
            serviceNew.gia2 = e.gia_tra_lai || e.gia2;
            serviceNew.gia_nt2 = e.gia_tra_lai || e.gia2;
            serviceNew.vt_ton_kho = e.vt_ton_kho;
            serviceNew.tien_giam = e.tien_giam;
            serviceNew.tl_giam = e.tl_giam;
            serviceNew.line_nbr = i;
            return serviceNew;
        });
        rs.map((e, i) => { e.line_nbr = i; });
        des.push(...rs);
    }

    convertBuyBackServiceToRequest = (services: any, masterInfo: any, TCreator: { new(): any; }) => {
        const result = services.map((service: any) => {
            const rs = new TCreator();
            Object.keys(rs).map((key: string) => {
                if (service.hasOwnProperty(key)) {
                    (rs as any)[key] = service[key];
                }
            });
            rs.gia = service.gia; // giá nhập trước thuế
            rs.gia_nt = service.gia; // giá nhập trước thuế
            rs.gia2 = service.gia_ban;
            rs.gia_nt2 = service.gia_ban;
            rs.gia_ck = service.gia_ck;
            rs.gia_ck_nt = service.gia_ck;
            rs.ck = service.tien_ck;
            rs.ck_nt = service.tien_ck;
            rs.tien2 = service.thanh_tien;
            rs.tien_nt2 = service.thanh_tien;
            rs.tien = service.thanh_tien;
            rs.tien_nt = service.thanh_tien;
            rs.thue_suat = service.thue_suat;
            rs.thue = service.tien_thue;
            rs.thue_nt = service.tien_thue;
            rs.tt = service.tong_tien;
            rs.tt_nt = service.tong_tien;
            rs.km_yn = service.km_yn ? 1 : 0;
            rs.gia_vat = service.gia_vat; // giá nhập mua sau thuế
            rs.gia_vat_nt = service.gia_vat; // giá nhập mua sau thuế
            rs.s4 = service.gia_ban; // giá đã bán
            rs.stt_rec_hd = service.stt_rec_hd;
            rs.stt_rec0hd = service.stt_rec0hd;
            rs.so_ct_hd = service.so_ct_hd;
            rs.ngay_ct_hd = service.ngay_ct_hd;
            rs.stt_rec0 = service.stt_rec0;

            return rs;
        });

        this.commonService.updateBaseInfo(masterInfo, result);
        return result;
    };
}
