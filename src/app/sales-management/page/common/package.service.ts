import { Injectable } from '@angular/core';
import { Service, ServiceRequest } from '@app/sales-management/model/ticket/common-model/service.model';
import { CommonService } from './common.service';
import { Discount } from '@app/sales-management/model/ticket/common-model/discount.model';
import { Option } from '@app/sales-management/model/ticket/common-model/option.model';
import { Package, PackageRequest } from '@app/sales-management/model/ticket/common-model/package.model';


@Injectable({
    providedIn: 'root'
})
export class PackageOfMerchandiseService {
    constructor(private commonService: CommonService) { }

    addNew(ma_imei: string, src: Package[], des: Package[]) {
        const rs = src.map((e: any, i: number) => {
            const serviceNew = new Package();
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

    addNewPackageSale(src: any[], des: any[]) {
        const rs = src.map((e: any, i: number) => {
            const serviceNew = new Package();
            Object.keys(serviceNew).map((key: string) => {
                if (e.hasOwnProperty(key)) {
                    (serviceNew as any)[key] = e[key];
                }
            });
            return serviceNew;
        });
        des.push(...rs);
        des.map((e, i) => e.line_nbr = i);
    }

    removePackage(item: any, des: any[]) {
        des.splice(item.line_nbr, 1);
        des.map((e, i) => e.line_nbr = i);
    }

    removePackageAfterRemoveMerchandise(merchandise: any, des: any[]) {
        des.filter(e => e.ma_imei === merchandise.ma_imei).map(service => {
            des.splice(service.line_nbr, 1);
            des.map((e, i) => e.line_nbr = i);
        });
    }

    // removePromotionPackage(service: any, packages: any[], merchandises: any[], discounts: Discount[], option: Option) {
    //     this.removePackage(service, packages);
    //     const merchandiseMain = this.getByImeiBuy(service.ma_imei, merchandises);
    //     if (merchandiseMain) {
    //         merchandiseMain.tien_ck_qd += service.tien_kmqd;
    //         merchandiseMain.tien_ck += service.tien_kmqd;
    //         merchandiseMain.gia_ck = merchandiseMain.gia_ban - (merchandiseMain.tien_ck / (1 + (merchandiseMain.thue_suat / 100)));
    //         merchandiseMain.thanh_tien = Math.round(merchandiseMain.gia_ck * merchandiseMain.so_luong);

    //         merchandiseMain.thanh_toan = (merchandiseMain.gia_vat * merchandiseMain.so_luong) - merchandiseMain.tien_ck;
    //         merchandiseMain.tien_thue = merchandiseMain.thanh_toan - merchandiseMain.thanh_tien;
    //         const discount = discounts.find(x => {
    //             return x.ma_imei && service.ma_imei && x.ma_imei.trim() == service.ma_imei.trim();
    //         });
    //         if (discount) {
    //             discount.tien_ck += service.tien_kmqd;
    //             discount.tien_ck_nt += service.tien_kmqd;
    //         }
    //         return true;
    //     }
    //     return false;
    // }

    getByImeiBuy(ma_imei: string, merchandises: any[]): any | undefined {
        return merchandises.find(e => e.ma_imei.trim() === ma_imei.trim());
    }

    convertPackageToRequest = (packages: any, masterInfo: any, TCreator: { new(): any; }) => {
        const result = packages.map((_package: any) => {
            const rs = new TCreator();
            Object.keys(rs).map((key: string) => {
                if (_package.hasOwnProperty(key)) {
                    (rs as any)[key] = _package[key];
                }
            });
            rs.gia = _package.gia_ban;
            rs.gia_nt = _package.gia_ban;
            rs.gia2 = _package.gia_ban;
            rs.gia_nt2 = _package.gia_ban;
            rs.gia_ck = _package.gia_ck;
            rs.gia_ck_nt = _package.gia_ck;
            rs.ck = _package.tien_ck;
            rs.ck_nt = _package.tien_ck;
            rs.tien2 = _package.thanh_tien;
            rs.tien_nt2 = _package.thanh_tien;
            rs.tien = _package.thanh_tien;
            rs.tien_nt = _package.thanh_tien;
            rs.thue_suat = _package.thue_suat;
            rs.thue = _package.tien_thue;
            rs.thue_nt = _package.tien_thue;
            rs.tt = _package.tong_tien;
            rs.tt_nt = _package.tong_tien;
            rs.km_yn = _package.km_yn ? 1 : 0;
            rs.gia_vat = _package.gia_vat;
            rs.gia_vat_nt = _package.gia_vat;

            return rs;
        });

        this.commonService.updateBaseInfo(masterInfo, result);
        return result;
    };

    convertFromVoucher(src: any[], des: any[], TCreator?: { new(): any; }) {
        const rs = src.map((e: any, i: number) => {
            let packageNew = new Package();
            if (TCreator) {
                packageNew = new TCreator();
            }
            Object.keys(packageNew).map((key: string) => {
                if (e.hasOwnProperty(key)) {
                    (packageNew as any)[key] = e[key];
                }
            });
            packageNew.tien_ck = e.ck;
            packageNew.gia_ban = e.gia2;
            packageNew.thanh_tien = e.tien2;
            packageNew.tien_thue = e.thue;
            packageNew.tong_tien = e.tt;
            packageNew.line_nbr = i;
            return packageNew;
        });
        rs.map((e, i) => { e.line_nbr = i; });
        des.push(...rs);
    }

    convertReturnPackageFromVoucher(src: any[], des: any[], TCreator: { new(): any; }) {
        const rs = src.map((e: any, i: number) => {
            const serviceNew = new TCreator();
            Object.keys(serviceNew).map((key: string) => {
                if (e.hasOwnProperty(key)) {
                    (serviceNew as any)[key] = e[key];
                }
            });
            serviceNew.ma_thue = e.ma_thue;
            serviceNew.stt_rec_hd1 = e.stt_rec;
            serviceNew.stt_rec0hd1 = e.stt_rec0;
            serviceNew.gia_ban = e.gia;
            serviceNew.thanh_tien = e.tien2;
            serviceNew.tien_thue = e.thue;
            serviceNew.tong_tien = e.tt;
            serviceNew.line_nbr = i;
            return serviceNew;
        });
        rs.map((e, i) => { e.line_nbr = i; });
        des.push(...rs);
    }
}