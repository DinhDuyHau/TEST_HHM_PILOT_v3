
import { ImeiApiService } from '@app/sales-management/api/imei-api.service';
import { DISCOUNT_TYPE, Discount } from '@app/sales-management/model/ticket/common-model/discount.model';
import { CommonService } from './common.service';
import { Injectable } from '@angular/core';
import { Merchandise } from '@app/sales-management/model/ticket/retail/model';
import { Service } from '@app/sales-management/model/ticket/common-model/service.model';
import { Option } from '@app/sales-management/model/ticket/common-model/option.model';
import { VoucherCodeService } from './voucher-code.service';
import { VoucherCode } from '@app/sales-management/model/ticket/common-model/base-entity.model';



@Injectable({
    providedIn: 'root'
})
export class MerchandiseService {

    constructor(
        private imeiApiService: ImeiApiService,
        private commonService: CommonService,
        private voucherCodeService: VoucherCodeService
    ) { }

    getMerchandiseNotHaveImei(ma_vt: string, merchandise: any[]): any | undefined {
        return merchandise.find(e => this.compareMerchandiseCode(e.ma_vt, ma_vt) && !e.ma_imei);
    }

    getMerchandiseByMaVT(ma_vt: string, merchandise: any[]): any | undefined {
        return merchandise.find(e => this.compareMerchandiseCode(e.ma_vt, ma_vt));
    }
    getMerchandiseByMaVTAndMaKho(ma_vt: string, ma_kho: string, merchandise: any[]): any | undefined {
        return merchandise.find(e => this.compareMerchandiseCode(e.ma_vt.trim(), ma_vt.trim()) && this.compareMerchandiseCode(e.ma_kho.trim(), ma_kho.trim()));
    }
    checkImeiExistMerchandise(ma_imei: string, merchandise: any[]) {
        return merchandise.find(e => this.compareMerchandiseCode(e.ma_imei, ma_imei));
    }

    compareMerchandiseCode(val1: string, val2: string) {
        return val1.replace(/\s+/g, '') === val2.replace(/\s+/g, '');
    }

    updateImei(ma_imei: string, merchandise: any) {
        merchandise.ma_imei = ma_imei;
    }

    addNew(merchandise: any, merchandises: any[], TCreator: { new(): any; }) {
        const merchandiseNew = this.createNewMerchandise(merchandise, TCreator);
        merchandiseNew.gia_ck = merchandiseNew.gia_ban;
        merchandiseNew.line_nbr = merchandises.length + 1;
        //giá niêm yết (s4)
        merchandiseNew.s4 = merchandise.s4;
        //giá điều chỉnh(s5)
        merchandiseNew.s5 = 0;
        //imei xuất bán
        merchandiseNew.gc_td1 = merchandise.gc_td1;
        merchandiseNew.ma_td3 = merchandise.ma_cttc;
        merchandiseNew.ma_td2 = merchandise.ma_kb;
        merchandises.push(merchandiseNew);
    }

    addNewRepurchase(merchandise: any, merchandises: any[], TCreator: { new(): any; }) {
        const merchandiseNew = this.createNewMerchandise(merchandise, TCreator);
        merchandiseNew.gia_ck = merchandiseNew.gia_ban;
        merchandiseNew.line_nbr = merchandises.length + 1;
        //giá niêm yết (s4)
        merchandiseNew.s4 = merchandise.s4;
        //giá điều chỉnh(s5)
        merchandiseNew.s5 = 0;
        merchandiseNew.gc_td1 = merchandise.gc_td1;
        merchandiseNew.ma_td3 = merchandise.ma_td3;
        merchandiseNew.ma_td2 = merchandise.ma_td2;
        merchandises.push(merchandiseNew);
    }

    removeMerchandise(item: any, merchandises: any[]) {
        if (!merchandises || merchandises.length <= 0) return;
        const line_index = merchandises[0].line_nbr == 0 ? Number(item.line_nbr) : Number(item.line_nbr) - 1;
        merchandises.splice(line_index, 1);
        merchandises.map((e, i) => e.line_nbr = i + 1);
    }

    removeMerchandise2(item: any, merchandises: any[]) {
        if (!merchandises || merchandises.length <= 0) return;

        // Tìm chỉ mục của phần tử cần xóa dựa trên ma_vt và ma_imei
        const indexToRemove = merchandises.findIndex(
            (e) => e.ma_vt === item.ma_vt && e.ma_imei === item.ma_imei
        );

        // Nếu tìm thấy phần tử phù hợp, tiến hành xóa
        if (indexToRemove !== -1) {
            merchandises.splice(indexToRemove, 1);

            // Cập nhật lại line_nbr sau khi xóa
            merchandises.forEach((e, i) => {
                e.line_nbr = i + 1;
            });
        }
    }

    removePromotionMechandise(merchandise: Merchandise, merchandises: Merchandise[], discounts: Discount[], option: Option) {
        this.removeMerchandise(merchandise, merchandises);
        const merchandiseMain = this.getByImeiBuy(merchandise.imei_mua, merchandises);

        // let option_thue: Option = new Option;
        // option_thue.he_so_lam_tron = 1;
        // option_thue.he_so_qd = 1;
        // option_thue.he_so_qd_tien = 1;

        if (merchandiseMain) {
            merchandiseMain.tien_ck_qd += merchandise.tien_kmqd;
            merchandiseMain.tien_ck += merchandise.tien_kmqd;
            merchandiseMain.gia_ck = merchandiseMain.gia_ban - (merchandiseMain.tien_ck / (1 + (merchandiseMain.thue_suat / 100)));

            // xử lý tính lại giá tmdt cho phiếu bán tmđt
            // đây là hàm chung nên cần kiểm tra xem có các trường cần thiết không trước khi tính toán
            if ('gia_tmdt' in merchandiseMain &&
                'gia_tmdt_vat' in merchandiseMain &&
                'tong_phi' in merchandiseMain &&
                'gia_vat' in merchandiseMain
            ) {
                // cộng lại tổng phí lần nữa cho chính xác
                merchandiseMain.tong_phi = merchandiseMain.phi_san_01 +
                    merchandiseMain.phi_san_02 + merchandiseMain.phi_san_03 +
                    merchandiseMain.phi_san_04 + merchandiseMain.phi_san_05 +
                    merchandiseMain.phi_san_06 + merchandiseMain.phi_san_07 +
                    merchandiseMain.phi_dc_khac;
                // làm tròn tổng phí
                merchandiseMain.tong_phi = Math.round(merchandiseMain.tong_phi);
                // tính lại giá tmdt
                merchandiseMain.gia_tmdt_vat = merchandiseMain.gia_vat + Math.round(merchandiseMain.tong_phi) - merchandiseMain.tien_ck;
                merchandiseMain.gia_tmdt = Math.round(merchandiseMain.gia_tmdt_vat / (1 + merchandiseMain.thue_suat / 100));
            }

            merchandiseMain.thanh_tien = Math.round(merchandiseMain.gia_ck * merchandiseMain.so_luong);
            // merchandiseMain.tien_thue = this.commonService.rouding(merchandiseMain.thanh_tien * merchandiseMain.thue_suat / 100, option_thue);
            merchandiseMain.thanh_toan = (merchandiseMain.gia_vat * merchandiseMain.so_luong) - merchandiseMain.tien_ck;
            merchandiseMain.tien_thue = merchandiseMain.thanh_toan - merchandiseMain.thanh_tien;
            const discount = discounts.find(x => {
                return x.ma_imei && merchandise.imei_mua && x.ma_imei.trim().toLowerCase() == merchandise.imei_mua.trim().toLowerCase();
            });

            if (discount) {
                discount.tien_ck += merchandise.tien_kmqd;
                discount.tien_ck_nt += merchandise.tien_kmqd;
            }
            return true;
        }
        return false;
    }

    removePromotionMerchandiseByOrderImei(imei_mua: string, merchandises: any[]) {
        merchandises.filter(e => this.compareMerchandiseCode(e.imei_mua, imei_mua)).forEach(item => {
            const line_nbr = item.line_nbr;
            if (line_nbr !== undefined) {
                merchandises.splice(Number(line_nbr) - 1, 1);
                merchandises.map((e, i) => e.line_nbr = i + 1);
            }
        });
    }

    getByImeiBuy(imei_mua: string, merchandises: any[]): any | undefined {
        return merchandises.find(e => e.ma_imei.trim() === imei_mua.trim());
    }

    swapMerchandise(cur: any, alt: any, merchandises: any[]) {
        alt.km_yn = true;
        alt.line_nbr = cur.line_nbr;
        alt.imei_mua = cur.imei_mua;
        merchandises[cur.line_nbr] = alt;
    }

    createNewMerchandise(merchandise: any, TCreator: { new(): any; }) {
        const merchandiseNew = new TCreator();
        Object.keys(merchandiseNew).forEach(key => {
            if (merchandise.hasOwnProperty(key)) {
                merchandiseNew[key] = merchandise[key];
            }
        });

        return merchandiseNew;
    }


    // #region calculate discount
    updatePriceForMerchandise(ticket: any, merchandises: any[], service?: any[]) {
        //update lại chiết khấu = 0 hết

        if (service) {
            service.map((e: Service) => {
                e.tien_ck = 0;
                e.gia_ck = e.gia_ban;
            });
        }

        merchandises.map((e: Merchandise) => {
            e.tien_ck = 0;
            e.gia_ck = e.gia_ban;
        });

        //ck 03
        let t_tien_ck03 = 0;
        const discountForMerchandise03 = ticket.discount.filter((e: any) => e.loai_ck === DISCOUNT_TYPE.GIFT);
        if (discountForMerchandise03 && discountForMerchandise03.length > 0) {
            const arr_ck03 = [];
            for (const discount of discountForMerchandise03) {
                if (discount.tien_ck > 0) {
                    t_tien_ck03 += discount.tien_ck;
                    arr_ck03.push({ ma_imei: discount.ma_imei.trim(), tien_ck: discount.tien_ck });
                }
            }
            if (t_tien_ck03 > 0 && arr_ck03 && arr_ck03.length > 0) {
                // cập nhật lại tien_ck_qd cho merchandise tương ứng với từng mã imei
                for (const item_ck03 of arr_ck03) {
                    const mer_item = merchandises.find(x => x.ma_imei.trim() === item_ck03.ma_imei);
                    if (mer_item) mer_item.tien_ck_qd = item_ck03.tien_ck;
                }
            }
        }

        // Loại bỏ những hàng hoá là hàng khuyến mãi
        const merchandiseUpdate = merchandises.filter((e: any) => !e.km_yn);
        let serviceUpdate: any[] = [];
        if (service) {
            serviceUpdate = service.filter((e: any) => !e.km_yn);
        }
        // merchandiseUpdate.map((e: any) => { e.tien_ck = 0; });

        //#region Chiết khấu 10 (chiết khấu mã giảm giá voucher)
        const discountForMerchandise10 = ticket.discount.filter((e: any) => e.loai_ck === DISCOUNT_TYPE.DISCOUNT_VOUCHER_CODE);
        (discountForMerchandise10 as any).forEach((discount: any) => {
            // console.log(discount);

            if (discount) {
                if (discount.type == 1) {
                    // chiết khấu phân bổ cho mặt hàng được áp dụng voucher
                    const merchandise_apply_voucher = JSON.parse(sessionStorage.getItem('merchandise_apply_voucher') || '[]');
                    const { tien_ck_max, tl_ck, campaign_id } = discount; // tien_ck_max = DiscountPrice => tiền chiết khấu tối đa
                    let tong_hang = merchandise_apply_voucher.reduce((sum: any, item: any) => sum + (item.gia_ban * item.so_luong), 0);
                    let tong_thue = merchandise_apply_voucher.reduce((sum: any, item: any) => sum + (item.gia_ban * item.so_luong * item.thue_suat / 100), 0);
                    let tong_tien = tong_hang + tong_thue;
                    let tien_ck_calc = 0;

                    // xử lý lấy tiền ck
                    if (tl_ck > 0) {
                        tien_ck_calc = this.commonService.rouding(tong_tien * tl_ck / 100);
                    }
                    if ((tien_ck_max > 0 && tien_ck_calc > tien_ck_max) || tl_ck == 0) {
                        tien_ck_calc = tien_ck_max;
                    }

                    // tien_ck trong tab ck
                    discount.tien_ck = tien_ck_calc;

                    let sum_ck_applied = 0;
                    const lastIndex = merchandise_apply_voucher.length - 1;
                    merchandise_apply_voucher.forEach((item: any, index: any) => {
                        let tien_ck_pb = this.commonService.rouding((item.gia_ban / tong_hang) * tien_ck_calc); // tiền ck phân bổ

                        if (index === lastIndex) {
                            tien_ck_pb = tien_ck_calc - sum_ck_applied; // tiền ck còn lại
                        } else {
                            sum_ck_applied += tien_ck_pb;
                        }

                        // set cho item trong tab hàng hóa
                        const merchan = merchandiseUpdate.find(x => x.ma_vt.trim().toLowerCase() == item.ma_vt.trim().toLowerCase()
                            && x.ma_imei.trim().toLowerCase() == item.ma_imei.trim().toLowerCase());
                        if (merchan) {
                            merchan.gia_ck -= tien_ck_pb;
                            merchan.tien_ck += tien_ck_pb;
                        }
                        // item.gia_ck -= tien_ck_pb;
                        // item.tien_ck += tien_ck_pb;

                        // add và tab mã giảm giá
                        const voucherCode = {
                            ma_voucher: discount.imei_hang_mua,
                            ma_vt: item.ma_vt,
                            ma_imei: item.ma_imei,
                            tien_ck: tien_ck_pb,
                            tl_ck: tl_ck,
                            ma_td1: campaign_id.toString()
                        }
                        this.voucherCodeService.addNew(voucherCode, ticket.voucherCode, VoucherCode);
                    });
                } else if (discount.type == 2) {
                    // chiết khấu theo mã vật tư chỉ định
                    const { ma_vt, tien_ck_max, tl_ck, ma_imei, campaign_id } = discount; // tien_ck_max = DiscountPrice => tiền chiết khấu tối đa
                    let tien_vat = 0;
                    let tien_ck_calc = 0;

                    // tìm vật tư cần áp dụng mã giảm giá
                    const mechandise = merchandiseUpdate.find(item =>
                        item.ma_vt?.trim().toLowerCase() === ma_vt.trim().toLowerCase() &&
                        item.ma_imei?.trim().toLowerCase() === ma_imei.trim().toLowerCase()
                    );

                    if (mechandise) {
                        // xử lý lấy tiền ck
                        if (tl_ck > 0) {
                            tien_vat = (mechandise.gia_ban * mechandise.so_luong) + (mechandise.gia_ban * mechandise.so_luong * mechandise.thue_suat / 100)
                            tien_ck_calc = this.commonService.rouding(tien_vat * tl_ck / 100);
                        }
                        if ((tien_ck_max > 0 && tien_ck_calc > tien_ck_max) || tl_ck == 0) {
                            tien_ck_calc = tien_ck_max;
                        }

                        tien_ck_calc = this.commonService.rouding(tien_ck_calc);

                        // tien_ck trong tab ck
                        discount.tien_ck = tien_ck_calc;

                        mechandise.gia_ck -= tien_ck_calc ? tien_ck_calc : 0;
                        mechandise.tien_ck += tien_ck_calc ? tien_ck_calc : 0;

                        const voucherCode = {
                            ma_voucher: discount.imei_hang_mua,
                            ma_vt: ma_vt,
                            ma_imei: ma_imei,
                            tien_ck: tien_ck_calc,
                            tl_ck: tl_ck,
                            ma_td1: campaign_id.toString()
                        }
                        this.voucherCodeService.addNew(voucherCode, ticket.voucherCode, VoucherCode);
                    }
                } else {
                    // chiết khấu tổng đơn hàng phân bổ cho từng mặt hàng
                    const { tien_ck_max, tl_ck, campaign_id } = discount; // tien_ck_max = DiscountPrice => tiền chiết khấu tối đa
                    let tong_hang = merchandiseUpdate.reduce((sum, item) => sum + (item.gia_ban * item.so_luong), 0);
                    let tong_thue = merchandiseUpdate.reduce((sum, item) => sum + (item.gia_ban * item.so_luong * item.thue_suat / 100), 0);
                    let tong_tien = tong_hang + tong_thue;
                    let tien_ck_calc = 0;

                    // xử lý lấy tiền ck
                    if (tl_ck > 0) {
                        tien_ck_calc = this.commonService.rouding(tong_tien * tl_ck / 100);
                    }
                    if ((tien_ck_max > 0 && tien_ck_calc > tien_ck_max) || tl_ck == 0) {
                        tien_ck_calc = tien_ck_max;
                    }

                    // tien_ck trong tab ck
                    discount.tien_ck = tien_ck_calc;

                    let sum_ck_applied = 0;
                    const lastIndex = merchandiseUpdate.length - 1;
                    merchandiseUpdate.forEach((item, index) => {
                        let tien_ck_pb = this.commonService.rouding((item.gia_ban / tong_hang) * tien_ck_calc); // tiền ck phân bổ

                        if (index === lastIndex) {
                            tien_ck_pb = tien_ck_calc - sum_ck_applied; // tiền ck còn lại
                        } else {
                            sum_ck_applied += tien_ck_pb;
                        }

                        item.gia_ck -= tien_ck_pb;
                        item.tien_ck += tien_ck_pb;

                        // add và tab mã giảm giá
                        const voucherCode = {
                            ma_voucher: discount.imei_hang_mua,
                            ma_vt: item.ma_vt,
                            ma_imei: item.ma_imei,
                            tien_ck: tien_ck_pb,
                            tl_ck: tl_ck,
                            ma_td1: campaign_id.toString()
                        }
                        this.voucherCodeService.addNew(voucherCode, ticket.voucherCode, VoucherCode);
                    });
                }
            }
        });
        //#endregion

        // Lấy chi tiết chiết khấu loại 01: Chiết khấu giá trị theo mã vật tư để cộng vào chi tiết chiết khấu
        const discountForMerchandise01 = ticket.discount.filter((e: any) => e.loai_ck === DISCOUNT_TYPE.REDUTION_BY_MERCHANDISE_CODE);
        (discountForMerchandise01 as any).forEach((discount: any) => {
            if (discount.details) {
                discount.details.forEach((detail: any) => {
                    const { ma_vt, tien_ck, tien_ck_tl, ma_imei } = detail;
                    const result = (merchandiseUpdate as any[]).filter((merchandise: any) => this.compareMerchandiseCode(merchandise.ma_vt, ma_vt) && !merchandise.km_yn);

                    // Tổng tiền hàng bán của phiếu có trong chiết khấu
                    const t_tien = result.map(e => e.gia_ban * e.so_luong).reduce((pre: any, cur: any) => pre + cur, 0);
                    let total = 0;
                    result.forEach((e: Merchandise, index) => {
                        if (e.ma_imei.trim().toLowerCase() == ma_imei.trim().toLowerCase() && e.ma_vt.trim().toLowerCase() == ma_vt.trim().toLowerCase()) {
                            e.gia_ck -= tien_ck ? tien_ck : 0;
                            e.tien_ck += tien_ck ? tien_ck : 0;
                        }
                        /**
                         * Tính phân bổ chưa đúng nên tạm thời bỏ
                         */
                        // if (index === merchandiseUpdate.length - 1) {
                        //     e.tien_ck += detail.tien_ck - total;
                        // } else {
                        //     const money = this.commonService.rouding((e.gia_ban * e.so_luong / t_tien) * detail.tien_ck);
                        //     e.tien_ck += money;
                        //     total += money;
                        // }
                        // e.gia_ck -= tien_ck ? tien_ck : tien_ck_tl;
                        // e.tien_ck += tien_ck ? tien_ck : tien_ck_tl;
                    });
                });
            }
        });

        // Lấy chi tiết chiết khấu loại 08: Chiết khấu giá trị theo mã dịch vụ để cộng vào chi tiết chiết khấu
        const discountForMerchandise08 = ticket.discount.filter((e: any) => e.loai_ck === DISCOUNT_TYPE.SERVICE_DISCOUNT);
        (discountForMerchandise08 as any).forEach((discount: any) => {
            if (discount.details) {
                discount.details.forEach((detail: any) => {
                    const { ma_dv, tien_ck, ma_imei } = detail;
                    const result = (serviceUpdate as any[]).filter((service: any) => this.compareMerchandiseCode(service.ma_dv, ma_dv) && !service.km_yn);

                    // Tổng tiền dịch vụ của phiếu có trong chiết khấu
                    const t_tien = result.map(e => e.gia_ban * e.so_luong).reduce((pre: any, cur: any) => pre + cur, 0);
                    let total = 0;
                    result.forEach((e: Service, index) => {
                        // kiểm tra đúng imei và ma_dv thì gán tien_ck
                        if (e.ma_imei.trim().toLowerCase() == ma_imei.trim().toLowerCase() && e.ma_dv.trim().toLowerCase() == ma_dv.trim().toLowerCase()) {
                            e.gia_ck -= tien_ck ? tien_ck : 0;
                            e.tien_ck += tien_ck ? tien_ck : 0;
                        }
                        /**
                         * Tính phân bổ chưa đúng nên tạm thời bỏ
                         */
                        // if (index === serviceUpdate.length - 1) {
                        //     e.tien_ck += detail.tien_ck - total;
                        // } else {
                        //     const money = this.commonService.rouding((e.gia_ban * e.so_luong / t_tien) * detail.tien_ck);
                        //     e.tien_ck += money;
                        //     total += money;
                        // }
                    });
                });
            }
        });

        //#region Chiết khấu 05
        // Lấy chi tiết chiết khấu loại 05: Chiết khấu hàng tặng kèm
        const discountForMerchandise05 = ticket.discount.filter((e: any) => e.loai_ck === DISCOUNT_TYPE.CROSS_SELLING).sort((a: any, b: any) => { return -a.uu_tien + b.uu_tien; });
        const markerArray = merchandiseUpdate.filter(x => !x.km_yn).map(x => { return { ma_vt: x.ma_vt, marker: false }; });
        markerArray.push(...serviceUpdate.filter(x => !x.km_yn).map(x => { return { ma_vt: x.ma_dv, marker: false }; }));

        const discount_valid05: any[] = [];
        if (discountForMerchandise05 && discountForMerchandise05.length > 0) for (const discount of discountForMerchandise05) {
            // Kiểm tra và đánh dấu xem các vật tư đã được hưởng chiết khấu từ trước đó hay chưa
            // Nếu các vật tư chưa đánh dấu vẫn thoả mãn điều kiện được hưởng thì vẫn được hưởng

            // 2024-11-13: sửa bỏ đoạn code dưới => cho phép áp dụng bán kèm đồng thời nhiều mã ck
            /*
            const detail: any[] = [];
            markerArray.filter(x => !x.marker).forEach((item: any) => {
                const item_discount = discount.details.find((x: any) => x.ma_vt_ad.trim() === item.ma_vt.trim());
                if (item_discount) {
                    detail.push(item_discount);
                    item.marker = true;
                }
            });
            */
            // => code thay thế đoạn code comment ở trên
            const detail: any[] = [];
            if (discount && discount.details && discount.details.length > 0)
                for (const item_discount of discount.details) {
                    detail.push(item_discount);
                }
            // 2024-11-13: end

            if (detail && detail.length > 0 && detail.filter(x => x.hangban_yn).length < discount.details.filter((x: any) => x.hangban_yn).length || detail.filter(x => x.hangban_yn).length == detail.length) {
                markerArray.filter(marker => detail.find((item: any) => marker.ma_vt.trim() === item.ma_vt_ad.trim())).forEach(x => x.marker = false);
            }
            else {
                if (discount.type == 1) {
                    const tien_ck = detail.map(e => e.tien_ck || e.tien_ck_tl).reduce((pre, cur) => pre + cur, 0);
                    discount.tien_ck = tien_ck;
                    if (discount.details) {
                        const arr_imei_ck05: string[] = [];
                        discount.details.forEach((detail: any) => {
                            const { ma_vt_ad, tien_ck, tien_ck_tl, hangban_yn, dv_yn, ma_dv, tien_ck_item, ma_imei_ad } = detail;
                            if (!dv_yn) {
                                const result = (merchandiseUpdate as any[]).filter((merchandise: any) => !hangban_yn &&
                                    this.compareMerchandiseCode(merchandise.ma_vt, ma_vt_ad)
                                );

                                // result.forEach((e: Merchandise) => {
                                //     e.gia_ck -= tien_ck_item ? tien_ck_item : tien_ck_tl;
                                //     e.tien_ck += tien_ck_item ? tien_ck_item : tien_ck_tl;
                                // });

                                for (const item of result) {
                                    const e = item as Merchandise;
                                    //Chỉ set tiền ck cho các imei chưa áp dụng ck 05 (không tồn tại trong arr_imei_ck05)
                                    if (!arr_imei_ck05.includes(e.ma_imei)) {
                                        e.gia_ck -= tien_ck ? tien_ck : tien_ck_tl;
                                        e.tien_ck += tien_ck ? tien_ck : tien_ck_tl;
                                        arr_imei_ck05.push(e.ma_imei);
                                    }
                                }
                            }
                            else {
                                const result = (serviceUpdate as any[]).filter((service: any) => this.compareMerchandiseCode(service.ma_dv, ma_dv) && !hangban_yn);
                                // result.forEach((e: Service) => {
                                //     e.gia_ck -= tien_ck_item ? tien_ck_item : tien_ck_tl;
                                //     e.tien_ck += tien_ck_item ? tien_ck_item : tien_ck_tl;
                                // });

                                for (const item of result) {
                                    const e = item as Service;
                                    //Chỉ set tiền ck cho các imei chưa áp dụng ck 05 (không tồn tại trong arr_imei_ck05)
                                    // if (!arr_imei_ck05.includes(e.ma_imei)) {
                                    //     e.gia_ck -= tien_ck ? tien_ck : tien_ck_tl;
                                    //     e.tien_ck += tien_ck ? tien_ck : tien_ck_tl;
                                    //     arr_imei_ck05.push(e.ma_imei);
                                    // }

                                    if (e.ma_dv.trim().toLowerCase() === ma_dv.trim().toLowerCase() && e.ma_imei.trim().toLowerCase() === ma_imei_ad.trim().toLowerCase()) {
                                        e.gia_ck -= tien_ck ? tien_ck : tien_ck_tl;
                                        e.tien_ck += tien_ck ? tien_ck : tien_ck_tl;
                                        arr_imei_ck05.push(e.ma_imei);
                                    }
                                }
                            }
                        });
                    }
                }
                // Type = 0 thì phải phân bổ lại tiền chiết khấu theo giá bán
                else {
                    if (!discount.tien_ck) {
                        const t_tien = detail.map(e => e.gia_ban).reduce((pre, cur) => pre + cur, 0);
                        discount.tien_ck = t_tien / 100 * discount.tl_ck;
                    }
                    if (discount.details) {
                        // Tiền chiết khấu sẽ phân bổ sẽ là tiền chiết khấu hoặc tièn chiết khấu sau khi tính toán với tỉ lệ
                        const discountMoneyTotal = discount.tien_ck || discount.tien_ck_tl;
                        // Tiền đã được phân bổ vào trong chi tiết - dùng để phân bổ cho dòng cuối cùng
                        let total = 0;
                        // Lấy danh sách hàng bán có trong chiết khấu
                        const merchandiseInDiscount = (merchandiseUpdate as any[]).filter((merchandise: any) => {
                            return discount.details.find((detail: any) => this.compareMerchandiseCode(merchandise.ma_vt, detail.ma_vt_ad) && !detail.hangban_yn);
                        });
                        // Lấy danh sách dịch vụ có trong chiết khấu
                        const serviceInDiscount = (serviceUpdate as any[]).filter((service: any) => {
                            return discount.details.find((detail: any) => this.compareMerchandiseCode(service.ma_dv, detail.ma_vt_ad) && !detail.hangban_yn);
                        });

                        // Số lượng hàng bán và dịch vụ của phiếu có trong chiết khấu
                        const length = merchandiseInDiscount.length + serviceInDiscount.length;

                        // Tổng tiền hàng bán và dịch vụ của phiếu có trong chiết khấu
                        let t_tien = merchandiseInDiscount.map(e => e.gia_ban * e.so_luong).reduce((pre: any, cur: any) => pre + cur, 0);
                        if (serviceInDiscount && serviceInDiscount.length) {
                            t_tien = serviceInDiscount.map(e => e.gia_ban * e.so_luong).reduce((pre: any, cur: any) => pre + cur, t_tien);
                        }

                        let index = 0;
                        discount.details.forEach((detail: any) => {
                            const { ma_vt_ad, tien_ck, tien_ck_tl, hangban_yn, dv_yn, ma_dv } = detail;
                            if (!dv_yn) {
                                const result = (merchandiseUpdate as any[]).filter((merchandise: any) => this.compareMerchandiseCode(merchandise.ma_vt, ma_vt_ad) && !hangban_yn);
                                result.forEach((item: Merchandise) => {
                                    if (index === length - 1) {
                                        item.tien_ck += discountMoneyTotal - total;
                                    }
                                    else {
                                        const money = this.commonService.rouding((item.gia_ban * item.so_luong / t_tien) * discountMoneyTotal);
                                        item.tien_ck += money;
                                        total += money;
                                    }
                                    index++;
                                });
                            }
                            else {
                                const result = (serviceUpdate as any[]).filter((service: any) => this.compareMerchandiseCode(service.ma_dv, ma_dv) && !hangban_yn);
                                result.forEach((item: Service) => {
                                    if (index === length - 1) {
                                        item.tien_ck += discountMoneyTotal - total;
                                    }
                                    else {
                                        const money = this.commonService.rouding((item.gia_ban * item.so_luong / t_tien) * discountMoneyTotal);
                                        item.tien_ck += money;
                                        total += money;
                                    }
                                    index++;
                                });
                            }
                        });
                    }
                }
                const exists_discount = discount_valid05.find(x => x.ma_ck == discount.ma_ck);
                if (exists_discount) {
                    exists_discount.tien_ck += discount.tien_ck;
                } else {
                    discount_valid05.push({ ...discount });
                }
            }
        }
        ticket.discount = ticket.discount.filter((x: any) => x.loai_ck !== DISCOUNT_TYPE.CROSS_SELLING);
        ticket.discount.push(...discount_valid05);
        //#endregion


        //#region Chiết khấu 06
        const markerArray06 = merchandises.filter(x => !x.km_yn).map(x => { return { ma_imei: x.ma_imei, ma_vt: x.ma_vt, gia_ban: x.gia_ban, marker: false }; }).sort((a: any, b: any) => b.gia_ban - a.gia_ban);
        // Lấy chiết khấu loại 06: Chiết khấu combo phụ kiện theo thứ tự giảm dần đồ ưu tiên
        const discountForMerchandise06 = ticket.discount.filter(
            (e: any) => e.loai_ck === DISCOUNT_TYPE.ACCESSORY_COMBO).sort((a: any, b: any) => { return -a.uu_tien + b.uu_tien; });
        const discount_valid: any[] = [];
        for (const discount of discountForMerchandise06) {
            let flag = true;
            if (!discount || !discount.details) continue;

            // Nhóm chiết khấu lại theo ma_ck, rec
            const group_discount: any[] = [];
            discount.details.forEach((item: any) => {
                if (!group_discount.find(x => x.ma_ck == item.ma_ck && x.rec == item.rec)) {
                    group_discount.push(item);
                }
            });

            while (flag) {
                const sl_nhom = discount.sl_nhom;
                const detail: any[] = [];

                // Đầu tiên phải lấy được các vật tư phải có tức là bat_buoc_yn = 1
                markerArray06.filter(x => !x.marker).forEach((merchandise: any) => {
                    if (detail.length != sl_nhom) {
                        const item_discount = discount.details.filter((x: any) => x.bat_buoc_yn == true).find((x: any) => x.ma_imei.trim() === merchandise.ma_imei.trim());
                        if (item_discount && !detail.find(x => x.rec == item_discount.rec)) {
                            //
                            detail.push(item_discount);
                            merchandise.marker = true;
                        }
                    }
                });
                const sl_bat_buoc = detail.length;
                markerArray06.filter(x => !x.marker).forEach((merchandise: any) => {
                    if (detail.length != sl_nhom) {
                        const item_discount = discount.details.find((x: any) => x.ma_imei.trim() === merchandise.ma_imei.trim());
                        if (item_discount && !detail.find(x => x.rec == item_discount.rec)) {
                            //
                            detail.push(item_discount);
                            merchandise.marker = true;
                        }
                    }
                });
                if (detail.length != sl_nhom || sl_bat_buoc != group_discount.filter(x => x.bat_buoc_yn == true).length) {
                    flag = false;
                    markerArray06.filter(marker => detail.find((item: any) => marker.ma_imei.trim() === item.ma_imei.trim())).forEach(x => x.marker = false);
                }
                else {
                    if (discount.type == 1) {
                        const tien_ck = detail.map(e => e.tien_ck || e.tien_ck_tl).reduce((pre, cur) => pre + cur, 0);
                        if (discount.tien_ck_max) {
                            if (tien_ck > discount.tien_ck_max) {
                                discount.tien_ck = discount.tien_ck_max;
                                discount.type = 0;
                            }
                            else {
                                discount.tien_ck = tien_ck;
                            }
                        } else {
                            discount.tien_ck = tien_ck;
                        }
                        if (detail) {
                            detail.forEach((detail: any) => {
                                const { ma_imei, tien_ck, tien_ck_tl } = detail;
                                const result = (merchandiseUpdate as any[]).filter((merchandise: any) => this.compareMerchandiseCode(merchandise.ma_imei, ma_imei));
                                result.forEach((e: Merchandise) => {
                                    e.gia_ck -= tien_ck ? tien_ck : tien_ck_tl;
                                    e.tien_ck += tien_ck ? tien_ck : tien_ck_tl;
                                });
                            });
                        }
                    }
                    // Type = 0 thì phải phân bổ lại tiền chiết khấu theo giá bán
                    else {
                        if (!discount.tien_ck) {
                            const t_tien = detail.map(e => e.gia_ban).reduce((pre, cur) => pre + cur, 0);
                            discount.tien_ck = t_tien / 100 * discount.tl_ck;
                        }
                        if (detail) {
                            // Tiền chiết khấu sẽ phân bổ sẽ là tiền chiết khấu hoặc tièn chiết khấu sau khi tính toán với tỉ lệ
                            let discountMoneyTotal = discount.tien_ck || discount.tien_ck_tl;
                            if (discountMoneyTotal > discount.tien_ck_max) {
                                discountMoneyTotal = discount.tien_ck_max;
                                discount.tien_ck = discountMoneyTotal;
                            }

                            // Tiền đã được phân bổ vào trong chi tiết - dùng để phân bổ cho dòng cuối cùng
                            let total = 0;
                            // Lấy danh sách hàng bán có trong chiết khấu
                            const merchandiseInDiscount = (merchandiseUpdate as any[]).filter((merchandise: any) => {
                                return detail.find((detail: any) => this.compareMerchandiseCode(merchandise.ma_vt, detail.ma_vt_ad) && !detail.hangban_yn);
                            });
                            // Số lượng hàng bán có trong chiết khấu
                            const length = merchandiseInDiscount.length;

                            // Tổng tiền hàng bán của phiếu có trong chiết khấu
                            const t_tien = merchandiseInDiscount.map(e => e.gia_ban * e.so_luong).reduce((pre: any, cur: any) => pre + cur, 0);

                            let index = 0;
                            detail.forEach((detail: any) => {
                                const { ma_vt_ad, tien_ck, tien_ck_tl, hangban_yn, dv_yn, ma_dv } = detail;
                                const result = (merchandiseUpdate as any[]).filter((merchandise: any) => this.compareMerchandiseCode(merchandise.ma_vt, ma_vt_ad));
                                result.forEach((item: Merchandise) => {
                                    if (index === length - 1) {
                                        item.tien_ck += discountMoneyTotal - total;
                                    }
                                    else {
                                        const money = this.commonService.rouding((item.gia_ban * item.so_luong / t_tien) * discountMoneyTotal);
                                        item.tien_ck += money;
                                        total += money;
                                    }
                                    index++;
                                });
                            });
                        }
                    }
                    const exists_discount = discount_valid.find(x => x.ma_ck == discount.ma_ck);
                    if (exists_discount) {
                        exists_discount.tien_ck += discount.tien_ck;
                    } else {
                        discount_valid.push({ ...discount });
                    }
                }
            }
        };
        ticket.discount = ticket.discount.filter((x: any) => x.loai_ck !== DISCOUNT_TYPE.ACCESSORY_COMBO);
        ticket.discount.push(...discount_valid);
        //#endregion

        //#region Chiết khấu 04 (chiết khấu ngoại giao)
        //áp dụng trực tiếp với các đúng imei được chiết khấu, không thực hiện phân bổ
        const discountCK04 = ticket.discount.filter((e: any) => e.loai_ck === DISCOUNT_TYPE.REDUTION_FOR_CUSTOMER);
        (discountCK04 as any).forEach((discount: any) => {
            const result = (merchandiseUpdate as any[]).filter((merchandise: any) =>
                this.compareMerchandiseCode(merchandise.ma_imei, discount.ma_imei) && !merchandise.km_yn
            );
            if (result && result.length > 0)
                result[0].tien_ck += discount.tien_ck;
        });
        //#endregion

        //#region  phân bổ tiền chiết khấu vào trong chi tiết
        const discounts = ticket.discount.filter((e: any) =>
            // Không thực hiện phân bổ chiết khấu ngoại giao
            // e.loai_ck === DISCOUNT_TYPE.REDUTION_FOR_CUSTOMER ||
            e.loai_ck === DISCOUNT_TYPE.REDUTION_FOR_TICKET
        );
        const discountMoneyTotal = discounts.map((e: any) => e.tien_ck).reduce((pre: any, cur: any) => pre + cur, 0);

        let t_tien = merchandiseUpdate.map(e => e.gia_ban * e.so_luong).reduce((pre: any, cur: any) => pre + cur, 0);
        if (serviceUpdate && serviceUpdate.length) {
            t_tien = serviceUpdate.map(e => e.gia_ban * e.so_luong).reduce((pre: any, cur: any) => pre + cur, t_tien);
        }
        let total = 0;
        if (serviceUpdate) {
            (serviceUpdate as any[]).forEach((service, index) => {
                const money = this.commonService.rouding((service.gia_ban * service.so_luong / t_tien) * discountMoneyTotal);
                service.tien_ck += money;
                total += money;
            });
        }
        (merchandiseUpdate as any[]).forEach((merchandise, index) => {
            if (index === merchandiseUpdate.length - 1) {
                merchandise.tien_ck += discountMoneyTotal - total;
            } else {
                const money = this.commonService.rouding((merchandise.gia_ban * merchandise.so_luong / t_tien) * discountMoneyTotal);
                merchandise.tien_ck += money;
                total += money;
            }
        });

        //#endregion

        // let option: Option = new Option;

        merchandiseUpdate.map((e: any) => {
            e.tien_ck += e.tien_ck_qd;

            e.gia_ck = e.gia_ban - (e.tien_ck / (1 + (e.thue_suat / 100)));

            // gọi hàm xử lý ck 09
            this.calcDiscount09(ticket, merchandiseUpdate, e);

            //Xử lý làm tròn giá ck sau khi trừ bị âm hoặc trong khoảng 0-0.49
            e.gia_ck = (e.gia_ck < 0 || (e.gia_ck > 0 && e.gia_ck < 0.5)) ? Math.abs(Math.round(e.gia_ck)) : e.gia_ck;
            e.gia_ck = Math.round(e.gia_ck);

            e.thanh_tien = Math.round(e.gia_ck * e.so_luong);
            // e.tien_thue = Math.round(e.thanh_tien * e.thue_suat / 100);
            // e.tien_thue = e.thanh_tien * e.thue_suat / 100;
            // e.thanh_toan = this.commonService.rouding(e.thanh_tien + e.tien_thue, option);

            /**
             * 2024-05-15: cài đặt công thức tính tổng thanh toán và tiền thuế như sau
             *      tổng thanh toán = giá full vat x số lượng - tiền chiết khấu
             *      thuế = tổng thanh toán - thành tiền
             */
            e.thanh_toan = (e.gia_vat * e.so_luong) - e.tien_ck;
            // nếu có ck 09 thì xử lý
            if (e.tien_kb09) {
                e.thanh_toan = e.thanh_toan - e.tien_kb09;
            }
            if (e.tl_ck_sau_vat09) {
                e.thanh_toan = e.thanh_toan - e.tl_ck_sau_vat09;
            }
            e.tien_thue = e.thanh_toan - e.thanh_tien;
            // 2024-05-15: end


        });

        serviceUpdate.map((e: Service) => {
            e.gia_ck = Math.round(e.gia_ban - (e.tien_ck / (1 + (e.thue_suat / 100))));
            e.thanh_tien = e.gia_ck * e.so_luong;
            // e.tien_thue = Math.round(e.thanh_tien * e.thue_suat / 100);
            // e.tien_thue = e.thanh_tien * e.thue_suat / 100;
            // e.tong_tien = this.commonService.rouding(e.thanh_tien + e.tien_thue, option);

            /**
             * 2024-05-15: cài đặt công thức tính tổng thanh toán và tiền thuế như sau
             *      tổng thanh toán = giá full vat x số lượng - tiền chiết khấu
             *      thuế = tổng thanh toán - thành tiền
             */
            e.tong_tien = (e.gia_vat * e.so_luong) - e.tien_ck;
            e.tien_thue = e.tong_tien - e.thanh_tien;
            // 2024-05-15: end
        });
    }

    // #endregion calculate discount


    // #region convert
    convertMerchandiseToRequest = (merchandises: any, masterInfo: any, TCreator: { new(): any; }) => {
        const result = (merchandises as any[]).map(merchandise => {
            // repurchase and renew
            merchandise.gia = merchandise.gia_ban;
            merchandise.gia_nt = merchandise.gia_ban;
            merchandise.tien = merchandise.thanh_tien;
            merchandise.tien_nt = merchandise.thanh_tien;

            // merchandise.gia_ban = merchandise.gia_ban;
            merchandise.gia_ban_nt = merchandise.gia_ban;
            merchandise.gia2 = merchandise.gia_ban;
            merchandise.gia_nt2 = merchandise.gia_ban;
            // merchandise.gia_ck = merchandise.gia_ck;
            merchandise.gia_ck_nt = merchandise.gia_ck;
            merchandise.ck = merchandise.tien_ck;
            merchandise.ck_nt = merchandise.tien_ck;
            merchandise.tien2 = merchandise.thanh_tien;
            merchandise.tien_nt2 = merchandise.thanh_tien;
            merchandise.thue = merchandise.tien_thue;
            merchandise.thue_nt = merchandise.tien_thue;
            merchandise.tt = merchandise.thanh_toan;
            merchandise.tt_nt = merchandise.thanh_toan;
            merchandise.gc_td1 = merchandise.gc_td1 || '';
            merchandise.ma_td1 = merchandise.ma_td1 || '';
            merchandise.gc_td2 = merchandise.gc_td2 || '';

            //

            const rs = this.createNewMerchandise(merchandise, TCreator);
            rs.km_yn ? rs.km_yn = 1 : rs.km_yn = 0;
            Object.keys(rs).forEach(key => {
                if (rs[key] === undefined) {
                    delete rs[key];
                }
            });
            return rs;
        });

        this.commonService.updateBaseInfo(masterInfo, result);
        return result;
    };

    convertFromVoucher(src: any[], des: any[], TCreator: { new(): any; }, ext: any[] = []) {
        const result = src.map(merchandise => {
            const rs = this.createNewMerchandise(merchandise, TCreator);
            rs.gia_ban = merchandise.gia_ban || merchandise.gia_ban_nt || merchandise.gia_nt;
            rs.gia_ck = merchandise.gia_ck || merchandise.gia_ck_nt;
            rs.tien_ck = merchandise.ck || merchandise.ck_nt;
            rs.thanh_tien = merchandise.tien2 || merchandise.tien_nt2 || merchandise.tien_nt;
            rs.tien_thue = merchandise.thue || merchandise.thue_nt;
            rs.thanh_toan = merchandise.tt || merchandise.tt_nt;

            //2025-03-10: không map trường stt_rec_hd đối với chứng từ trả nợ quà (BHI) => lấy theo dữ liệu response từ server
            if (merchandise.ma_ct !== 'BHI') {
                rs.stt_rec_hd = merchandise.stt_rec;
                rs.stt_rec0hd = merchandise.stt_rec0;
            }

            rs.hd_so = merchandise.so_ct || '';
            rs.s7 = merchandise.ngay_ct || '';
            rs.no_km_yn = merchandise.no_km_yn == 1 ? true : false;

            // Kiểm tra nếu có truyền mảng ext và tìm đối tượng trong ext có stt_rec giống với stt_rec_dh1 của merchandise
            if (ext.length > 0) {
                const extItem = ext.find(item => item.stt_rec === merchandise.stt_rec_hd1);
                if (extItem) {
                    rs.ma_td1 = extItem.ma_kh_tmdt || '';
                    rs.gc_td1 = extItem.ma_dh || '';
                    rs.gc_td2 = extItem.ma_van_don || '';
                }
            }

            Object.keys(rs).forEach(key => {
                if (rs[key] === undefined) {
                    delete rs[key];
                }
            });
            return rs;
        });
        result.map((e, i) => { e.line_nbr = i + 1; });
        des.push(...result);

        // test nhân đôi hàng hoá
        // result.forEach((e, i) => {
        //     e.line_nbr = i * 2 + 1;

        //     const clone = { ...e };
        //     clone.line_nbr = i * 2 + 2;
        //     if (clone.ma_imei) {
        //         clone.ma_imei += '_CLONE';
        //     } else {
        //         clone.ma_imei = 'CLONE_' + (i + 1);
        //     }

        //     des.push(e);
        //     des.push(clone);
        // });
    }

    convertFromVoucherView(src: any[], des: any[], TCreator: { new(): any; }) {
        const result = src.map(merchandise => {
            const rs = this.createNewMerchandise(merchandise, TCreator);
            rs.gia_ban = merchandise.gia_ban || merchandise.gia_ban_nt || merchandise.gia_nt;
            rs.gia_ck = merchandise.gia_ck || merchandise.gia_ck_nt;
            rs.tien_ck = merchandise.ck || merchandise.ck_nt;
            rs.thanh_tien = merchandise.tien2 || merchandise.tien_nt2 || merchandise.tien_nt;
            rs.tien_thue = merchandise.thue || merchandise.thue_nt;
            rs.thanh_toan = merchandise.tt || merchandise.tt_nt;
            rs.stt_rec_dh = merchandise.stt_rec_dh;
            rs.hd_so = merchandise.hd_so || '';
            rs.s7 = (merchandise.s7?.includes('1900-01-01') ? '' : merchandise.s7) || '';
            rs.ma_td1 = merchandise.ma_td1 || '';
            rs.gc_td1 = merchandise.gc_td1 || '';
            rs.gc_td2 = merchandise.gc_td2 || '';

            Object.keys(rs).forEach(key => {
                if (rs[key] === undefined) {
                    delete rs[key];
                }
            });
            return rs;
        });
        result.map((e, i) => { e.line_nbr = i + 1; });
        des.push(...result);
    }

    updatePriceForEcommerce(ticket: any, merchandises: any[], service?: any[]) {
        //update lại chiết khấu = 0 hết

        if (service) {
            service.map((e: Service) => {
                e.tien_ck = 0;
                e.gia_ck = e.gia_ban;
            });
        }

        merchandises.map((e: Merchandise) => {
            e.tien_ck = 0;
            e.gia_ck = e.gia_ban;
        });

        // Loại bỏ những hàng hoá là hàng khuyến mãi
        const merchandiseUpdate = merchandises.filter((e: any) => !e.km_yn);
        let serviceUpdate: any[] = [];
        if (service) {
            serviceUpdate = service.filter((e: any) => !e.km_yn);
        }
        // merchandiseUpdate.map((e: any) => { e.tien_ck = 0; });

        // Lấy chi tiết chiết khấu loại 01: Chiết khấu giá trị theo mã vật tư để cộng vào chi tiết chiết khấu
        const discountForMerchandise01 = ticket.discount.filter((e: any) => e.loai_ck === DISCOUNT_TYPE.REDUTION_BY_MERCHANDISE_CODE);
        (discountForMerchandise01 as any).forEach((discount: any) => {
            if (discount.details) {
                discount.details.forEach((detail: any) => {
                    const { ma_vt, tien_ck, tien_ck_tl, ma_imei } = detail;
                    const result = (merchandiseUpdate as any[]).filter((merchandise: any) => this.compareMerchandiseCode(merchandise.ma_vt, ma_vt) && !merchandise.km_yn);

                    // Tổng tiền hàng bán của phiếu có trong chiết khấu
                    const t_tien = result.map(e => e.gia_ban * e.so_luong).reduce((pre: any, cur: any) => pre + cur, 0);
                    let total = 0;
                    result.forEach((e: Merchandise, index) => {
                        if (e.ma_imei.trim().toLowerCase() == ma_imei.trim().toLowerCase() && e.ma_vt.trim().toLowerCase() == ma_vt.trim().toLowerCase()) {
                            e.gia_ck -= tien_ck ? tien_ck : 0;
                            e.tien_ck += tien_ck ? tien_ck : 0;
                        }
                        /**
                         * Tính phân bổ chưa đúng nên tạm thời bỏ
                         */
                        // if (index === merchandiseUpdate.length - 1) {
                        //     e.tien_ck += detail.tien_ck - total;
                        // } else {
                        //     const money = this.commonService.rouding((e.gia_ban * e.so_luong / t_tien) * detail.tien_ck);
                        //     e.tien_ck += money;
                        //     total += money;
                        // }
                        // e.gia_ck -= tien_ck ? tien_ck : tien_ck_tl;
                        // e.tien_ck += tien_ck ? tien_ck : tien_ck_tl;
                    });
                });
            }
        });

        // Lấy chi tiết chiết khấu loại 08: Chiết khấu giá trị theo mã dịch vụ để cộng vào chi tiết chiết khấu
        const discountForMerchandise08 = ticket.discount.filter((e: any) => e.loai_ck === DISCOUNT_TYPE.SERVICE_DISCOUNT);
        (discountForMerchandise08 as any).forEach((discount: any) => {
            if (discount.details) {
                discount.details.forEach((detail: any) => {
                    const { ma_dv, tien_ck, ma_imei } = detail;
                    const result = (serviceUpdate as any[]).filter((service: any) => this.compareMerchandiseCode(service.ma_dv, ma_dv) && !service.km_yn);

                    // Tổng tiền dịch vụ của phiếu có trong chiết khấu
                    const t_tien = result.map(e => e.gia_ban * e.so_luong).reduce((pre: any, cur: any) => pre + cur, 0);
                    let total = 0;
                    result.forEach((e: Service, index) => {
                        // kiểm tra đúng imei và ma_dv thì gán tien_ck
                        if (e.ma_imei.trim() == ma_imei.trim() && e.ma_dv.trim() == ma_dv.trim()) {
                            e.gia_ck -= tien_ck ? tien_ck : 0;
                            e.tien_ck += tien_ck ? tien_ck : 0;
                        }
                        /**
                        * Tính phân bổ chưa đúng nên tạm thời bỏ
                        */
                        // if (index === serviceUpdate.length - 1) {
                        //     e.tien_ck += detail.tien_ck - total;
                        // } else {
                        //     const money = this.commonService.rouding((e.gia_ban * e.so_luong / t_tien) * detail.tien_ck);
                        //     e.tien_ck += money;
                        //     total += money;
                        // }
                    });
                });
            }
        });

        //#region Chiết khấu 05
        // Lấy chi tiết chiết khấu loại 05: Chiết khấu hàng tặng kèm
        const discountForMerchandise05 = ticket.discount.filter((e: any) => e.loai_ck === DISCOUNT_TYPE.CROSS_SELLING).sort((a: any, b: any) => { return -a.uu_tien + b.uu_tien; });
        const markerArray = merchandiseUpdate.filter(x => !x.km_yn).map(x => { return { ma_vt: x.ma_vt, marker: false }; });
        markerArray.push(...serviceUpdate.filter(x => !x.km_yn).map(x => { return { ma_vt: x.ma_dv, marker: false }; }));

        const discount_valid05: any[] = [];

        (discountForMerchandise05 as any).forEach((discount: any) => {
            // Kiểm tra và đánh dấu xem các vật tư đã được hưởng chiết khấu từ trước đó hay chưa
            // Nếu các vật tư chưa đánh dấu vẫn thoả mãn điều kiện được hưởng thì vẫn được hưởng
            const detail: any[] = [];
            markerArray.filter(x => !x.marker).forEach((item: any) => {
                const item_discount = discount.details.find((x: any) => x.ma_vt_ad.trim() === item.ma_vt.trim());
                if (item_discount) {
                    detail.push(item_discount);
                    item.marker = true;
                }
            });
            if (detail.filter(x => x.hangban_yn).length < discount.details.filter((x: any) => x.hangban_yn).length || detail.filter(x => x.hangban_yn).length == detail.length) {
                markerArray.filter(marker => detail.find((item: any) => marker.ma_vt.trim() === item.ma_vt_ad.trim())).forEach(x => x.marker = false);
            }
            else {
                if (discount.type == 1) {
                    const tien_ck = detail.map(e => e.tien_ck || e.tien_ck_tl).reduce((pre, cur) => pre + cur, 0);
                    discount.tien_ck = tien_ck;
                    if (discount.details) {
                        discount.details.forEach((detail: any) => {
                            const { ma_vt_ad, tien_ck, tien_ck_tl, hangban_yn, dv_yn, ma_dv } = detail;
                            if (!dv_yn) {
                                const result = (merchandiseUpdate as any[]).filter((merchandise: any) => this.compareMerchandiseCode(merchandise.ma_vt, ma_vt_ad) && !hangban_yn);
                                result.forEach((e: Merchandise) => {
                                    e.gia_ck -= tien_ck ? tien_ck : tien_ck_tl;
                                    e.tien_ck += tien_ck ? tien_ck : tien_ck_tl;
                                });
                            }
                            else {
                                const result = (serviceUpdate as any[]).filter((service: any) => this.compareMerchandiseCode(service.ma_dv, ma_dv) && !hangban_yn);
                                result.forEach((e: Service) => {
                                    e.gia_ck -= tien_ck ? tien_ck : tien_ck_tl;
                                    e.tien_ck += tien_ck ? tien_ck : tien_ck_tl;
                                });
                            }
                        });
                    }
                }
                // Type = 0 thì phải phân bổ lại tiền chiết khấu theo giá bán
                else {
                    if (!discount.tien_ck) {
                        const t_tien = detail.map(e => e.gia_ban).reduce((pre, cur) => pre + cur, 0);
                        discount.tien_ck = t_tien / 100 * discount.tl_ck;
                    }
                    if (discount.details) {
                        // Tiền chiết khấu sẽ phân bổ sẽ là tiền chiết khấu hoặc tièn chiết khấu sau khi tính toán với tỉ lệ
                        const discountMoneyTotal = discount.tien_ck || discount.tien_ck_tl;
                        // Tiền đã được phân bổ vào trong chi tiết - dùng để phân bổ cho dòng cuối cùng
                        let total = 0;
                        // Lấy danh sách hàng bán có trong chiết khấu
                        const merchandiseInDiscount = (merchandiseUpdate as any[]).filter((merchandise: any) => {
                            return discount.details.find((detail: any) => this.compareMerchandiseCode(merchandise.ma_vt, detail.ma_vt_ad) && !detail.hangban_yn);
                        });
                        // Lấy danh sách dịch vụ có trong chiết khấu
                        const serviceInDiscount = (serviceUpdate as any[]).filter((service: any) => {
                            return discount.details.find((detail: any) => this.compareMerchandiseCode(service.ma_dv, detail.ma_vt_ad) && !detail.hangban_yn);
                        });

                        // Số lượng hàng bán và dịch vụ của phiếu có trong chiết khấu
                        const length = merchandiseInDiscount.length + serviceInDiscount.length;

                        // Tổng tiền hàng bán và dịch vụ của phiếu có trong chiết khấu
                        let t_tien = merchandiseInDiscount.map(e => e.gia_ban * e.so_luong).reduce((pre: any, cur: any) => pre + cur, 0);
                        if (serviceInDiscount && serviceInDiscount.length) {
                            t_tien = serviceInDiscount.map(e => e.gia_ban * e.so_luong).reduce((pre: any, cur: any) => pre + cur, t_tien);
                        }

                        let index = 0;
                        discount.details.forEach((detail: any) => {
                            const { ma_vt_ad, tien_ck, tien_ck_tl, hangban_yn, dv_yn, ma_dv } = detail;
                            if (!dv_yn) {
                                const result = (merchandiseUpdate as any[]).filter((merchandise: any) => this.compareMerchandiseCode(merchandise.ma_vt, ma_vt_ad) && !hangban_yn);
                                result.forEach((item: Merchandise) => {
                                    if (index === length - 1) {
                                        item.tien_ck += discountMoneyTotal - total;
                                    }
                                    else {
                                        const money = this.commonService.rouding((item.gia_ban * item.so_luong / t_tien) * discountMoneyTotal);
                                        item.tien_ck += money;
                                        total += money;
                                    }
                                    index++;
                                });
                            }
                            else {
                                const result = (serviceUpdate as any[]).filter((service: any) => this.compareMerchandiseCode(service.ma_dv, ma_dv) && !hangban_yn);
                                result.forEach((item: Service) => {
                                    if (index === length - 1) {
                                        item.tien_ck += discountMoneyTotal - total;
                                    }
                                    else {
                                        const money = this.commonService.rouding((item.gia_ban * item.so_luong / t_tien) * discountMoneyTotal);
                                        item.tien_ck += money;
                                        total += money;
                                    }
                                    index++;
                                });
                            }
                        });
                    }
                }
                const exists_discount = discount_valid05.find(x => x.ma_ck == discount.ma_ck);
                if (exists_discount) {
                    exists_discount.tien_ck += discount.tien_ck;
                } else {
                    discount_valid05.push({ ...discount });
                }
            }
        });
        ticket.discount = ticket.discount.filter((x: any) => x.loai_ck !== DISCOUNT_TYPE.CROSS_SELLING);
        ticket.discount.push(...discount_valid05);
        //#endregion


        //#region Chiết khấu 06
        const markerArray06 = merchandises.filter(x => !x.km_yn).map(x => { return { ma_imei: x.ma_imei, ma_vt: x.ma_vt, gia_ban: x.gia_ban, marker: false }; }).sort((a: any, b: any) => b.gia_ban - a.gia_ban);
        // Lấy chiết khấu loại 06: Chiết khấu combo phụ kiện theo thứ tự giảm dần đồ ưu tiên
        const discountForMerchandise06 = ticket.discount.filter((e: any) => e.loai_ck === DISCOUNT_TYPE.ACCESSORY_COMBO).sort((a: any, b: any) => { return -a.uu_tien + b.uu_tien; });
        const discount_valid: any[] = [];
        (discountForMerchandise06 as any).forEach((discount: any) => {
            let flag = true;

            // Nhóm chiết khấu lại theo ma_ck, rec
            const group_discount: any[] = [];
            discount.details.forEach((item: any) => {
                if (!group_discount.find(x => x.ma_ck == item.ma_ck && x.rec == item.rec)) {
                    group_discount.push(item);
                }
            });

            while (flag) {
                const sl_nhom = discount.sl_nhom;
                const detail: any[] = [];

                // Đầu tiên phải lấy được các vật tư phải có tức là bat_buoc_yn = 1
                markerArray06.filter(x => !x.marker).forEach((merchandise: any) => {
                    if (detail.length != sl_nhom) {
                        const item_discount = discount.details.filter((x: any) => x.bat_buoc_yn == true).find((x: any) => x.ma_imei.trim() === merchandise.ma_imei.trim());
                        if (item_discount && !detail.find(x => x.rec == item_discount.rec)) {
                            //
                            detail.push(item_discount);
                            merchandise.marker = true;
                        }
                    }
                });
                const sl_bat_buoc = detail.length;
                markerArray06.filter(x => !x.marker).forEach((merchandise: any) => {
                    if (detail.length != sl_nhom) {
                        const item_discount = discount.details.find((x: any) => x.ma_imei.trim() === merchandise.ma_imei.trim());
                        if (item_discount && !detail.find(x => x.rec == item_discount.rec)) {
                            //
                            detail.push(item_discount);
                            merchandise.marker = true;
                        }
                    }
                });
                if (detail.length != sl_nhom || sl_bat_buoc != group_discount.filter(x => x.bat_buoc_yn == true).length) {
                    flag = false;
                    markerArray06.filter(marker => detail.find((item: any) => marker.ma_imei.trim() === item.ma_imei.trim())).forEach(x => x.marker = false);
                }
                else {
                    if (discount.type == 1) {
                        const tien_ck = detail.map(e => e.tien_ck || e.tien_ck_tl).reduce((pre, cur) => pre + cur, 0);
                        if (discount.tien_ck_max) {
                            if (tien_ck > discount.tien_ck_max) {
                                discount.tien_ck = discount.tien_ck_max;
                                discount.type = 0;
                            }
                            else {
                                discount.tien_ck = tien_ck;
                            }
                        } else {
                            discount.tien_ck = tien_ck;
                        }
                        if (detail) {
                            detail.forEach((detail: any) => {
                                const { ma_imei, tien_ck, tien_ck_tl } = detail;
                                const result = (merchandiseUpdate as any[]).filter((merchandise: any) => this.compareMerchandiseCode(merchandise.ma_imei, ma_imei));
                                result.forEach((e: Merchandise) => {
                                    e.gia_ck -= tien_ck ? tien_ck : tien_ck_tl;
                                    e.tien_ck += tien_ck ? tien_ck : tien_ck_tl;
                                });
                            });
                        }
                    }
                    // Type = 0 thì phải phân bổ lại tiền chiết khấu theo giá bán
                    else {
                        if (!discount.tien_ck) {
                            const t_tien = detail.map(e => e.gia_ban).reduce((pre, cur) => pre + cur, 0);
                            discount.tien_ck = t_tien / 100 * discount.tl_ck;
                        }
                        if (detail) {
                            // Tiền chiết khấu sẽ phân bổ sẽ là tiền chiết khấu hoặc tièn chiết khấu sau khi tính toán với tỉ lệ
                            const discountMoneyTotal = discount.tien_ck || discount.tien_ck_tl;
                            // Tiền đã được phân bổ vào trong chi tiết - dùng để phân bổ cho dòng cuối cùng
                            let total = 0;
                            // Lấy danh sách hàng bán có trong chiết khấu
                            const merchandiseInDiscount = (merchandiseUpdate as any[]).filter((merchandise: any) => {
                                return detail.find((detail: any) => this.compareMerchandiseCode(merchandise.ma_vt, detail.ma_vt_ad) && !detail.hangban_yn);
                            });
                            // Số lượng hàng bán có trong chiết khấu
                            const length = merchandiseInDiscount.length;

                            // Tổng tiền hàng bán của phiếu có trong chiết khấu
                            const t_tien = merchandiseInDiscount.map(e => e.gia_ban * e.so_luong).reduce((pre: any, cur: any) => pre + cur, 0);

                            let index = 0;
                            detail.forEach((detail: any) => {
                                const { ma_vt_ad, tien_ck, tien_ck_tl, hangban_yn, dv_yn, ma_dv } = detail;
                                const result = (merchandiseUpdate as any[]).filter((merchandise: any) => this.compareMerchandiseCode(merchandise.ma_vt, ma_vt_ad));
                                result.forEach((item: Merchandise) => {
                                    if (index === length - 1) {
                                        item.tien_ck += discountMoneyTotal - total;
                                    }
                                    else {
                                        const money = this.commonService.rouding((item.gia_ban * item.so_luong / t_tien) * discountMoneyTotal);
                                        item.tien_ck += money;
                                        total += money;
                                    }
                                    index++;
                                });
                            });
                        }
                    }
                    const exists_discount = discount_valid.find(x => x.ma_ck == discount.ma_ck);
                    if (exists_discount) {
                        exists_discount.tien_ck += discount.tien_ck;
                    } else {
                        discount_valid.push({ ...discount });
                    }
                }
            }
        });
        ticket.discount = ticket.discount.filter((x: any) => x.loai_ck !== DISCOUNT_TYPE.ACCESSORY_COMBO);
        ticket.discount.push(...discount_valid);
        //#endregion

        //#region Chiết khấu 04 (chiết khấu ngoại giao)
        //áp dụng trực tiếp với các đúng imei được chiết khấu, không thực hiện phân bổ
        const discountCK04 = ticket.discount.filter((e: any) => e.loai_ck === DISCOUNT_TYPE.REDUTION_FOR_CUSTOMER);
        (discountCK04 as any).forEach((discount: any) => {
            const result = (merchandiseUpdate as any[]).filter((merchandise: any) =>
                this.compareMerchandiseCode(merchandise.ma_imei, discount.ma_imei) && !merchandise.km_yn
            );
            if (result && result.length > 0)
                result[0].tien_ck += discount.tien_ck;
        });
        //#endregion

        //#region  phân bổ tiền chiết khấu vào trong chi tiết
        const discounts = ticket.discount.filter((e: any) =>
            // Không thực hiện phân bổ chiết khấu ngoại giao
            // e.loai_ck === DISCOUNT_TYPE.REDUTION_FOR_CUSTOMER ||
            e.loai_ck === DISCOUNT_TYPE.REDUTION_FOR_TICKET
        );
        const discountMoneyTotal = discounts.map((e: any) => e.tien_ck).reduce((pre: any, cur: any) => pre + cur, 0);

        let t_tien = merchandiseUpdate.map(e => e.gia_ban * e.so_luong).reduce((pre: any, cur: any) => pre + cur, 0);
        if (serviceUpdate && serviceUpdate.length) {
            t_tien = serviceUpdate.map(e => e.gia_ban * e.so_luong).reduce((pre: any, cur: any) => pre + cur, t_tien);
        }
        let total = 0;
        if (serviceUpdate) {
            (serviceUpdate as any[]).forEach((service, index) => {
                const money = this.commonService.rouding((service.gia_ban * service.so_luong / t_tien) * discountMoneyTotal);
                service.tien_ck += money;
                total += money;
            });
        }
        (merchandiseUpdate as any[]).forEach((merchandise, index) => {
            if (index === merchandiseUpdate.length - 1) {
                merchandise.tien_ck += discountMoneyTotal - total;
            } else {
                const money = this.commonService.rouding((merchandise.gia_ban * merchandise.so_luong / t_tien) * discountMoneyTotal);
                merchandise.tien_ck += money;
                total += money;
            }
        });

        //#endregion

        // let option: Option = new Option;

        merchandiseUpdate.map((e: any) => {

            e.tien_ck += e.tien_ck_qd;
            e.gia_ck = e.gia_ban - (e.tien_ck / (1 + (e.thue_suat / 100)));

            //Xử lý làm tròn giá ck sau khi trừ bị âm hoặc trong khoảng 0-0.49
            e.gia_ck = (e.gia_ck < 0 || (e.gia_ck > 0 && e.gia_ck < 0.5)) ? Math.abs(Math.round(e.gia_ck)) : e.gia_ck;

            e.gia_tmdt_vat = e.gia_vat + Math.round(e.tong_phi) - e.tien_ck;
            e.gia_tmdt = Math.round(e.gia_tmdt_vat / (1 + e.thue_suat / 100));
            e.tien_thue = e.gia_tmdt_vat - e.gia_tmdt;
            e.thanh_tien = e.gia_tmdt * e.so_luong;
            e.thanh_toan = e.gia_tmdt_vat * e.so_luong;

            /**
             * 2024-05-15: cài đặt công thức tính tổng thanh toán và tiền thuế như sau
             *      tổng thanh toán = giá full vat x số lượng - tiền chiết khấu
             *      thuế = tổng thanh toán - thành tiền
             */
            //e.thanh_toan = (e.gia_vat * e.so_luong) - e.tien_ck;
            //e.tien_thue = e.thanh_toan - e.thanh_tien;
            // 2024-05-15: end


        });

        serviceUpdate.map((e: Service) => {
            e.gia_ck = e.gia_ban - (e.tien_ck / (1 + (e.thue_suat / 100)));
            e.thanh_tien = Math.round(e.gia_ck * e.so_luong);
            // e.tien_thue = Math.round(e.thanh_tien * e.thue_suat / 100);
            // e.tien_thue = e.thanh_tien * e.thue_suat / 100;
            // e.tong_tien = this.commonService.rouding(e.thanh_tien + e.tien_thue, option);

            /**
             * 2024-05-15: cài đặt công thức tính tổng thanh toán và tiền thuế như sau
             *      tổng thanh toán = giá full vat x số lượng - tiền chiết khấu
             *      thuế = tổng thanh toán - thành tiền
             */
            e.tong_tien = (e.gia_vat * e.so_luong) - e.tien_ck;
            e.tien_thue = e.tong_tien - e.thanh_tien;
            // 2024-05-15: end
        });
    }
    //Bán hàng web-online
    updatePriceForMerchandiseOnline(ticket: any, merchandises: any[], service?: any[]) {
        //update lại chiết khấu = 0 hết

        if (service) {
            service.map((e: Service) => {
                e.tien_ck = 0;
                e.gia_ck = e.gia_ban;
            });
        }

        merchandises.map((e: Merchandise) => {
            e.tien_ck = 0;
            e.gia_ck = e.gia_ban;
        });

        //ck 03
        let t_tien_ck03 = 0;
        const discountForMerchandise03 = ticket.discount.filter((e: any) => e.loai_ck === DISCOUNT_TYPE.GIFT);
        if (discountForMerchandise03 && discountForMerchandise03.length > 0) {
            const arr_ck03 = [];
            for (const discount of discountForMerchandise03) {
                if (discount.tien_ck > 0) {
                    t_tien_ck03 += discount.tien_ck;
                    arr_ck03.push({ ma_imei: discount.ma_imei.trim(), tien_ck: discount.tien_ck });
                }
            }
            if (t_tien_ck03 > 0 && arr_ck03 && arr_ck03.length > 0) {
                // cập nhật lại tien_ck_qd cho merchandise tương ứng với từng mã imei
                for (const item_ck03 of arr_ck03) {
                    const mer_item = merchandises.find(x => x.ma_imei.trim() === item_ck03.ma_imei);
                    if (mer_item) mer_item.tien_ck_qd = item_ck03.tien_ck;
                }
            }
        }

        // Loại bỏ những hàng hoá là hàng khuyến mãi
        const merchandiseUpdate = merchandises.filter((e: any) => !e.km_yn);
        let serviceUpdate: any[] = [];
        if (service) {
            serviceUpdate = service.filter((e: any) => !e.km_yn);
        }
        // merchandiseUpdate.map((e: any) => { e.tien_ck = 0; });

        //#region Chiết khấu 10 (chiết khấu mã giảm giá voucher)
        const discountForMerchandise10 = ticket.discount.filter((e: any) => e.loai_ck === DISCOUNT_TYPE.DISCOUNT_VOUCHER_CODE);
        (discountForMerchandise10 as any).forEach((discount: any) => {
            if (discount) {
                if (discount.type == 1) {
                    // chiết khấu phân bổ cho mặt hàng được áp dụng voucher
                    const merchandise_apply_voucher = JSON.parse(sessionStorage.getItem('merchandise_apply_voucher') || '[]');
                    const { tien_ck_max, tl_ck, campaign_id } = discount; // tien_ck_max = DiscountPrice => tiền chiết khấu tối đa
                    let tong_hang = merchandise_apply_voucher.reduce((sum: any, item: any) => sum + (item.gia_ban * item.so_luong), 0);
                    let tong_thue = merchandise_apply_voucher.reduce((sum: any, item: any) => sum + (item.gia_ban * item.so_luong * item.thue_suat / 100), 0);
                    let tong_tien = tong_hang + tong_thue;
                    let tien_ck_calc = 0;

                    // xử lý lấy tiền ck
                    if (tl_ck > 0) {
                        tien_ck_calc = this.commonService.rouding(tong_tien * tl_ck / 100);
                    }
                    if ((tien_ck_max > 0 && tien_ck_calc > tien_ck_max) || tl_ck == 0) {
                        tien_ck_calc = tien_ck_max;
                    }

                    // tien_ck trong tab ck
                    discount.tien_ck = tien_ck_calc;

                    let sum_ck_applied = 0;
                    const lastIndex = merchandise_apply_voucher.length - 1;
                    merchandise_apply_voucher.forEach((item: any, index: any) => {
                        let tien_ck_pb = this.commonService.rouding((item.gia_ban / tong_hang) * tien_ck_calc); // tiền ck phân bổ

                        if (index === lastIndex) {
                            tien_ck_pb = tien_ck_calc - sum_ck_applied; // tiền ck còn lại
                        } else {
                            sum_ck_applied += tien_ck_pb;
                        }

                        // set cho item trong tab hàng hóa
                        const merchan = merchandiseUpdate.find(x => x.ma_vt.trim().toLowerCase() == item.ma_vt.trim().toLowerCase()
                            && x.ma_imei.trim().toLowerCase() == item.ma_imei.trim().toLowerCase());
                        merchan.gia_ck -= tien_ck_pb;
                        merchan.tien_ck += tien_ck_pb;
                        // item.gia_ck -= tien_ck_pb;
                        // item.tien_ck += tien_ck_pb;

                        // add và tab mã giảm giá
                        const voucherCode = {
                            ma_voucher: discount.imei_hang_mua,
                            ma_vt: item.ma_vt,
                            ma_imei: item.ma_imei,
                            tien_ck: tien_ck_pb,
                            tl_ck: tl_ck,
                            ma_td1: campaign_id.toString()
                        }
                        this.voucherCodeService.addNew(voucherCode, ticket.voucherCode, VoucherCode);
                    });
                } else if (discount.type == 2) {
                    // chiết khấu theo mã vật tư chỉ định
                    const { ma_vt, tien_ck_max, tl_ck, ma_imei, campaign_id } = discount; // tien_ck_max = DiscountPrice => tiền chiết khấu tối đa
                    let tien_vat = 0;
                    let tien_ck_calc = 0;

                    // tìm vật tư cần áp dụng mã giảm giá
                    const mechandise = merchandiseUpdate.find(item =>
                        item.ma_vt?.trim().toLowerCase() === ma_vt.trim().toLowerCase() &&
                        item.ma_imei?.trim().toLowerCase() === ma_imei.trim().toLowerCase()
                    );

                    if (mechandise) {
                        // xử lý lấy tiền ck
                        if (tl_ck > 0) {
                            tien_vat = (mechandise.gia_ban * mechandise.so_luong) + (mechandise.gia_ban * mechandise.so_luong * mechandise.thue_suat / 100)
                            tien_ck_calc = this.commonService.rouding(tien_vat * tl_ck / 100);
                        }
                        if ((tien_ck_max > 0 && tien_ck_calc > tien_ck_max) || tl_ck == 0) {
                            tien_ck_calc = tien_ck_max;
                        }

                        tien_ck_calc = this.commonService.rouding(tien_ck_calc);

                        // tien_ck trong tab ck
                        discount.tien_ck = tien_ck_calc;

                        mechandise.gia_ck -= tien_ck_calc ? tien_ck_calc : 0;
                        mechandise.tien_ck += tien_ck_calc ? tien_ck_calc : 0;

                        const voucherCode = {
                            ma_voucher: discount.imei_hang_mua,
                            ma_vt: ma_vt,
                            ma_imei: ma_imei,
                            tien_ck: tien_ck_calc,
                            tl_ck: tl_ck,
                            ma_td1: campaign_id.toString()
                        }
                        this.voucherCodeService.addNew(voucherCode, ticket.voucherCode, VoucherCode);
                    }
                } else {
                    // chiết khấu tổng đơn hàng phân bổ cho từng mặt hàng
                    const { tien_ck_max, tl_ck, campaign_id } = discount; // tien_ck_max = DiscountPrice => tiền chiết khấu tối đa
                    let tong_hang = merchandiseUpdate.reduce((sum, item) => sum + (item.gia_ban * item.so_luong), 0);
                    let tong_thue = merchandiseUpdate.reduce((sum, item) => sum + (item.gia_ban * item.so_luong * item.thue_suat / 100), 0);
                    let tong_tien = tong_hang + tong_thue;
                    let tien_ck_calc = 0;

                    // xử lý lấy tiền ck
                    if (tl_ck > 0) {
                        tien_ck_calc = this.commonService.rouding(tong_tien * tl_ck / 100);
                    }
                    if ((tien_ck_max > 0 && tien_ck_calc > tien_ck_max) || tl_ck == 0) {
                        tien_ck_calc = tien_ck_max;
                    }

                    // tien_ck trong tab ck
                    discount.tien_ck = tien_ck_calc;

                    let sum_ck_applied = 0;
                    const lastIndex = merchandiseUpdate.length - 1;
                    merchandiseUpdate.forEach((item, index) => {
                        let tien_ck_pb = this.commonService.rouding((item.gia_ban / tong_hang) * tien_ck_calc); // tiền ck phân bổ

                        if (index === lastIndex) {
                            tien_ck_pb = tien_ck_calc - sum_ck_applied; // tiền ck còn lại
                        } else {
                            sum_ck_applied += tien_ck_pb;
                        }

                        item.gia_ck -= tien_ck_pb;
                        item.tien_ck += tien_ck_pb;

                        // add và tab mã giảm giá
                        const voucherCode = {
                            ma_voucher: discount.imei_hang_mua,
                            ma_vt: item.ma_vt,
                            ma_imei: item.ma_imei,
                            tien_ck: tien_ck_pb,
                            tl_ck: tl_ck,
                            ma_td1: campaign_id.toString()
                        }
                        this.voucherCodeService.addNew(voucherCode, ticket.voucherCode, VoucherCode);
                    });
                }
            }
        });
        //#endregion

        // Lấy chi tiết chiết khấu loại 01: Chiết khấu giá trị theo mã vật tư để cộng vào chi tiết chiết khấu
        const discountForMerchandise01 = ticket.discount.filter((e: any) => e.loai_ck === DISCOUNT_TYPE.REDUTION_BY_MERCHANDISE_CODE);
        (discountForMerchandise01 as any).forEach((discount: any) => {
            if (discount.details) {
                discount.details.forEach((detail: any) => {
                    const { ma_vt, tien_ck, tien_ck_tl, ma_imei } = detail;
                    const result = (merchandiseUpdate as any[]).filter((merchandise: any) => this.compareMerchandiseCode(merchandise.ma_vt, ma_vt) && !merchandise.km_yn);

                    // Tổng tiền hàng bán của phiếu có trong chiết khấu
                    const t_tien = result.map(e => e.gia_ban * e.so_luong).reduce((pre: any, cur: any) => pre + cur, 0);
                    let total = 0;
                    result.forEach((e: Merchandise, index) => {
                        if (e.ma_imei.trim().toLowerCase() == ma_imei.trim().toLowerCase() && e.ma_vt.trim().toLowerCase() == ma_vt.trim().toLowerCase()) {
                            e.gia_ck -= tien_ck ? tien_ck : 0;
                            e.tien_ck += tien_ck ? tien_ck : 0;
                        }
                        /**
                         * Tính phân bổ chưa đúng nên tạm thời bỏ
                         */
                        // if (index === merchandiseUpdate.length - 1) {
                        //     e.tien_ck += detail.tien_ck - total;
                        // } else {
                        //     const money = this.commonService.rouding((e.gia_ban * e.so_luong / t_tien) * detail.tien_ck);
                        //     e.tien_ck += money;
                        //     total += money;
                        // }
                        // e.gia_ck -= tien_ck ? tien_ck : tien_ck_tl;
                        // e.tien_ck += tien_ck ? tien_ck : tien_ck_tl;
                    });
                });
            }
        });

        // Lấy chi tiết chiết khấu loại 08: Chiết khấu giá trị theo mã dịch vụ để cộng vào chi tiết chiết khấu
        const discountForMerchandise08 = ticket.discount.filter((e: any) => e.loai_ck === DISCOUNT_TYPE.SERVICE_DISCOUNT);
        (discountForMerchandise08 as any).forEach((discount: any) => {
            if (discount.details) {
                discount.details.forEach((detail: any) => {
                    const { ma_dv, tien_ck, ma_imei } = detail;
                    const result = (serviceUpdate as any[]).filter((service: any) => this.compareMerchandiseCode(service.ma_dv, ma_dv) && !service.km_yn);

                    // Tổng tiền dịch vụ của phiếu có trong chiết khấu
                    const t_tien = result.map(e => e.gia_ban * e.so_luong).reduce((pre: any, cur: any) => pre + cur, 0);
                    let total = 0;
                    result.forEach((e: Service, index) => {
                        // kiểm tra đúng imei và ma_dv thì gán tien_ck
                        if (e.ma_imei.trim() == ma_imei.trim() && e.ma_dv.trim() == ma_dv.trim()) {
                            e.gia_ck -= tien_ck ? tien_ck : 0;
                            e.tien_ck += tien_ck ? tien_ck : 0;
                        }
                        /**
                        * Tính phân bổ chưa đúng nên tạm thời bỏ
                        */
                        // if (index === serviceUpdate.length - 1) {
                        //     e.tien_ck += detail.tien_ck - total;
                        // } else {
                        //     const money = this.commonService.rouding((e.gia_ban * e.so_luong / t_tien) * detail.tien_ck);
                        //     e.tien_ck += money;
                        //     total += money;
                        // }
                    });
                });
            }
        });

        //#region Chiết khấu 05
        // Lấy chi tiết chiết khấu loại 05: Chiết khấu hàng tặng kèm
        const discountForMerchandise05 = ticket.discount.filter((e: any) => e.loai_ck === DISCOUNT_TYPE.CROSS_SELLING).sort((a: any, b: any) => { return -a.uu_tien + b.uu_tien; });
        const markerArray = merchandiseUpdate.filter(x => !x.km_yn).map(x => { return { ma_vt: x.ma_vt, marker: false }; });
        markerArray.push(...serviceUpdate.filter(x => !x.km_yn).map(x => { return { ma_vt: x.ma_dv, marker: false }; }));

        const discount_valid05: any[] = [];

        (discountForMerchandise05 as any).forEach((discount: any) => {
            // Kiểm tra và đánh dấu xem các vật tư đã được hưởng chiết khấu từ trước đó hay chưa
            // Nếu các vật tư chưa đánh dấu vẫn thoả mãn điều kiện được hưởng thì vẫn được hưởng
            const detail: any[] = [];
            markerArray.filter(x => !x.marker).forEach((item: any) => {
                const item_discount = discount.details.find((x: any) => x.ma_vt_ad.trim() === item.ma_vt.trim());
                if (item_discount) {
                    detail.push(item_discount);
                    item.marker = true;
                }
            });
            if (detail.filter(x => x.hangban_yn).length < discount.details.filter((x: any) => x.hangban_yn).length || detail.filter(x => x.hangban_yn).length == detail.length) {
                markerArray.filter(marker => detail.find((item: any) => marker.ma_vt.trim() === item.ma_vt_ad.trim())).forEach(x => x.marker = false);
            }
            else {
                if (discount.type == 1) {
                    const tien_ck = detail.map(e => e.tien_ck || e.tien_ck_tl).reduce((pre, cur) => pre + cur, 0);
                    discount.tien_ck = tien_ck;
                    if (discount.details) {
                        discount.details.forEach((detail: any) => {
                            const { ma_vt_ad, tien_ck, tien_ck_tl, hangban_yn, dv_yn, ma_dv } = detail;
                            if (!dv_yn) {
                                const result = (merchandiseUpdate as any[]).filter((merchandise: any) => this.compareMerchandiseCode(merchandise.ma_vt, ma_vt_ad) && !hangban_yn);
                                result.forEach((e: Merchandise) => {
                                    e.gia_ck -= tien_ck ? tien_ck : tien_ck_tl;
                                    e.tien_ck += tien_ck ? tien_ck : tien_ck_tl;
                                });
                            }
                            else {
                                const result = (serviceUpdate as any[]).filter((service: any) => this.compareMerchandiseCode(service.ma_dv, ma_dv) && !hangban_yn);
                                result.forEach((e: Service) => {
                                    e.gia_ck -= tien_ck ? tien_ck : tien_ck_tl;
                                    e.tien_ck += tien_ck ? tien_ck : tien_ck_tl;
                                });
                            }
                        });
                    }
                }
                // Type = 0 thì phải phân bổ lại tiền chiết khấu theo giá bán
                else {
                    if (!discount.tien_ck) {
                        const t_tien = detail.map(e => e.gia_ban).reduce((pre, cur) => pre + cur, 0);
                        discount.tien_ck = t_tien / 100 * discount.tl_ck;
                    }
                    if (discount.details) {
                        // Tiền chiết khấu sẽ phân bổ sẽ là tiền chiết khấu hoặc tièn chiết khấu sau khi tính toán với tỉ lệ
                        const discountMoneyTotal = discount.tien_ck || discount.tien_ck_tl;
                        // Tiền đã được phân bổ vào trong chi tiết - dùng để phân bổ cho dòng cuối cùng
                        let total = 0;
                        // Lấy danh sách hàng bán có trong chiết khấu
                        const merchandiseInDiscount = (merchandiseUpdate as any[]).filter((merchandise: any) => {
                            return discount.details.find((detail: any) => this.compareMerchandiseCode(merchandise.ma_vt, detail.ma_vt_ad) && !detail.hangban_yn);
                        });
                        // Lấy danh sách dịch vụ có trong chiết khấu
                        const serviceInDiscount = (serviceUpdate as any[]).filter((service: any) => {
                            return discount.details.find((detail: any) => this.compareMerchandiseCode(service.ma_dv, detail.ma_vt_ad) && !detail.hangban_yn);
                        });

                        // Số lượng hàng bán và dịch vụ của phiếu có trong chiết khấu
                        const length = merchandiseInDiscount.length + serviceInDiscount.length;

                        // Tổng tiền hàng bán và dịch vụ của phiếu có trong chiết khấu
                        let t_tien = merchandiseInDiscount.map(e => e.gia_ban * e.so_luong).reduce((pre: any, cur: any) => pre + cur, 0);
                        if (serviceInDiscount && serviceInDiscount.length) {
                            t_tien = serviceInDiscount.map(e => e.gia_ban * e.so_luong).reduce((pre: any, cur: any) => pre + cur, t_tien);
                        }

                        let index = 0;
                        discount.details.forEach((detail: any) => {
                            const { ma_vt_ad, tien_ck, tien_ck_tl, hangban_yn, dv_yn, ma_dv } = detail;
                            if (!dv_yn) {
                                const result = (merchandiseUpdate as any[]).filter((merchandise: any) => this.compareMerchandiseCode(merchandise.ma_vt, ma_vt_ad) && !hangban_yn);
                                result.forEach((item: Merchandise) => {
                                    if (index === length - 1) {
                                        item.tien_ck += discountMoneyTotal - total;
                                    }
                                    else {
                                        const money = this.commonService.rouding((item.gia_ban * item.so_luong / t_tien) * discountMoneyTotal);
                                        item.tien_ck += money;
                                        total += money;
                                    }
                                    index++;
                                });
                            }
                            else {
                                const result = (serviceUpdate as any[]).filter((service: any) => this.compareMerchandiseCode(service.ma_dv, ma_dv) && !hangban_yn);
                                result.forEach((item: Service) => {
                                    if (index === length - 1) {
                                        item.tien_ck += discountMoneyTotal - total;
                                    }
                                    else {
                                        const money = this.commonService.rouding((item.gia_ban * item.so_luong / t_tien) * discountMoneyTotal);
                                        item.tien_ck += money;
                                        total += money;
                                    }
                                    index++;
                                });
                            }
                        });
                    }
                }
                const exists_discount = discount_valid05.find(x => x.ma_ck == discount.ma_ck);
                if (exists_discount) {
                    exists_discount.tien_ck += discount.tien_ck;
                } else {
                    discount_valid05.push({ ...discount });
                }
            }
        });
        ticket.discount = ticket.discount.filter((x: any) => x.loai_ck !== DISCOUNT_TYPE.CROSS_SELLING);
        ticket.discount.push(...discount_valid05);
        //#endregion


        //#region Chiết khấu 06
        const markerArray06 = merchandises.filter(x => !x.km_yn).map(x => { return { ma_imei: x.ma_imei, ma_vt: x.ma_vt, gia_ban: x.gia_ban, marker: false }; }).sort((a: any, b: any) => b.gia_ban - a.gia_ban);
        // Lấy chiết khấu loại 06: Chiết khấu combo phụ kiện theo thứ tự giảm dần đồ ưu tiên
        const discountForMerchandise06 = ticket.discount.filter((e: any) => e.loai_ck === DISCOUNT_TYPE.ACCESSORY_COMBO).sort((a: any, b: any) => { return -a.uu_tien + b.uu_tien; });
        const discount_valid: any[] = [];
        (discountForMerchandise06 as any).forEach((discount: any) => {
            let flag = true;

            // Nhóm chiết khấu lại theo ma_ck, rec
            const group_discount: any[] = [];
            discount.details.forEach((item: any) => {
                if (!group_discount.find(x => x.ma_ck == item.ma_ck && x.rec == item.rec)) {
                    group_discount.push(item);
                }
            });

            while (flag) {
                const sl_nhom = discount.sl_nhom;
                const detail: any[] = [];

                // Đầu tiên phải lấy được các vật tư phải có tức là bat_buoc_yn = 1
                markerArray06.filter(x => !x.marker).forEach((merchandise: any) => {
                    if (detail.length != sl_nhom) {
                        const item_discount = discount.details.filter((x: any) => x.bat_buoc_yn == true).find((x: any) => x.ma_imei.trim() === merchandise.ma_imei.trim());
                        if (item_discount && !detail.find(x => x.rec == item_discount.rec)) {
                            //
                            detail.push(item_discount);
                            merchandise.marker = true;
                        }
                    }
                });
                const sl_bat_buoc = detail.length;
                markerArray06.filter(x => !x.marker).forEach((merchandise: any) => {
                    if (detail.length != sl_nhom) {
                        const item_discount = discount.details.find((x: any) => x.ma_imei.trim() === merchandise.ma_imei.trim());
                        if (item_discount && !detail.find(x => x.rec == item_discount.rec)) {
                            //
                            detail.push(item_discount);
                            merchandise.marker = true;
                        }
                    }
                });
                if (detail.length != sl_nhom || sl_bat_buoc != group_discount.filter(x => x.bat_buoc_yn == true).length) {
                    flag = false;
                    markerArray06.filter(marker => detail.find((item: any) => marker.ma_imei.trim() === item.ma_imei.trim())).forEach(x => x.marker = false);
                }
                else {
                    if (discount.type == 1) {
                        const tien_ck = detail.map(e => e.tien_ck || e.tien_ck_tl).reduce((pre, cur) => pre + cur, 0);
                        if (discount.tien_ck_max) {
                            if (tien_ck > discount.tien_ck_max) {
                                discount.tien_ck = discount.tien_ck_max;
                                discount.type = 0;
                            }
                            else {
                                discount.tien_ck = tien_ck;
                            }
                        } else {
                            discount.tien_ck = tien_ck;
                        }
                        if (detail) {
                            detail.forEach((detail: any) => {
                                const { ma_imei, tien_ck, tien_ck_tl } = detail;
                                const result = (merchandiseUpdate as any[]).filter((merchandise: any) => this.compareMerchandiseCode(merchandise.ma_imei, ma_imei));
                                result.forEach((e: Merchandise) => {
                                    e.gia_ck -= tien_ck ? tien_ck : tien_ck_tl;
                                    e.tien_ck += tien_ck ? tien_ck : tien_ck_tl;
                                });
                            });
                        }
                    }
                    // Type = 0 thì phải phân bổ lại tiền chiết khấu theo giá bán
                    else {
                        if (!discount.tien_ck) {
                            const t_tien = detail.map(e => e.gia_ban).reduce((pre, cur) => pre + cur, 0);
                            discount.tien_ck = t_tien / 100 * discount.tl_ck;
                        }
                        if (detail) {
                            // Tiền chiết khấu sẽ phân bổ sẽ là tiền chiết khấu hoặc tièn chiết khấu sau khi tính toán với tỉ lệ
                            const discountMoneyTotal = discount.tien_ck || discount.tien_ck_tl;
                            // Tiền đã được phân bổ vào trong chi tiết - dùng để phân bổ cho dòng cuối cùng
                            let total = 0;
                            // Lấy danh sách hàng bán có trong chiết khấu
                            const merchandiseInDiscount = (merchandiseUpdate as any[]).filter((merchandise: any) => {
                                return detail.find((detail: any) => this.compareMerchandiseCode(merchandise.ma_vt, detail.ma_vt_ad) && !detail.hangban_yn);
                            });
                            // Số lượng hàng bán có trong chiết khấu
                            const length = merchandiseInDiscount.length;

                            // Tổng tiền hàng bán của phiếu có trong chiết khấu
                            const t_tien = merchandiseInDiscount.map(e => e.gia_ban * e.so_luong).reduce((pre: any, cur: any) => pre + cur, 0);

                            let index = 0;
                            detail.forEach((detail: any) => {
                                const { ma_vt_ad, tien_ck, tien_ck_tl, hangban_yn, dv_yn, ma_dv } = detail;
                                const result = (merchandiseUpdate as any[]).filter((merchandise: any) => this.compareMerchandiseCode(merchandise.ma_vt, ma_vt_ad));
                                result.forEach((item: Merchandise) => {
                                    if (index === length - 1) {
                                        item.tien_ck += discountMoneyTotal - total;
                                    }
                                    else {
                                        const money = this.commonService.rouding((item.gia_ban * item.so_luong / t_tien) * discountMoneyTotal);
                                        item.tien_ck += money;
                                        total += money;
                                    }
                                    index++;
                                });
                            });
                        }
                    }
                    const exists_discount = discount_valid.find(x => x.ma_ck == discount.ma_ck);
                    if (exists_discount) {
                        exists_discount.tien_ck += discount.tien_ck;
                    } else {
                        discount_valid.push({ ...discount });
                    }
                }
            }
        });
        ticket.discount = ticket.discount.filter((x: any) => x.loai_ck !== DISCOUNT_TYPE.ACCESSORY_COMBO);
        ticket.discount.push(...discount_valid);
        //#endregion

        //#region Chiết khấu 04 (chiết khấu ngoại giao)
        //áp dụng trực tiếp với các đúng imei được chiết khấu, không thực hiện phân bổ
        const discountCK04 = ticket.discount.filter((e: any) => e.loai_ck === DISCOUNT_TYPE.REDUTION_FOR_CUSTOMER);
        (discountCK04 as any).forEach((discount: any) => {
            const result = (merchandiseUpdate as any[]).filter((merchandise: any) =>
                this.compareMerchandiseCode(merchandise.ma_imei, discount.ma_imei) && !merchandise.km_yn
            );
            if (result && result.length > 0)
                result[0].tien_ck += discount.tien_ck;
        });
        //#endregion

        //#region  phân bổ tiền chiết khấu vào trong chi tiết
        const discounts = ticket.discount.filter((e: any) =>
            // Không thực hiện phân bổ chiết khấu ngoại giao
            // e.loai_ck === DISCOUNT_TYPE.REDUTION_FOR_CUSTOMER ||
            e.loai_ck === DISCOUNT_TYPE.REDUTION_FOR_TICKET
        );
        const discountMoneyTotal = discounts.map((e: any) => e.tien_ck).reduce((pre: any, cur: any) => pre + cur, 0);

        let t_tien = merchandiseUpdate.map(e => e.gia_ban * e.so_luong).reduce((pre: any, cur: any) => pre + cur, 0);
        if (serviceUpdate && serviceUpdate.length) {
            t_tien = serviceUpdate.map(e => e.gia_ban * e.so_luong).reduce((pre: any, cur: any) => pre + cur, t_tien);
        }
        let total = 0;
        if (serviceUpdate) {
            (serviceUpdate as any[]).forEach((service, index) => {
                const money = this.commonService.rouding((service.gia_ban * service.so_luong / t_tien) * discountMoneyTotal);
                service.tien_ck += money;
                total += money;
            });
        }
        (merchandiseUpdate as any[]).forEach((merchandise, index) => {
            if (index === merchandiseUpdate.length - 1) {
                merchandise.tien_ck += discountMoneyTotal - total;
            } else {
                const money = this.commonService.rouding((merchandise.gia_ban * merchandise.so_luong / t_tien) * discountMoneyTotal);
                merchandise.tien_ck += money;
                total += money;
            }
        });

        //#endregion

        // let option: Option = new Option;

        merchandiseUpdate.map((e: any) => {
            //giá vat đã áp dụng giá điều chỉnh
            const gia_vat_dc = e.gia_vat + e.s5

            e.gia_ban = Math.round(gia_vat_dc / (1 + e.thue_suat / 100));
            e.tien_ck += e.tien_ck_qd;
            e.gia_ck = e.gia_ban - (e.tien_ck / (1 + (e.thue_suat / 100)));

            // gọi hàm xử lý ck 09
            this.calcDiscount09(ticket, merchandiseUpdate, e);

            //Xử lý làm tròn giá ck sau khi trừ bị âm hoặc trong khoảng 0-0.49
            e.gia_ck = (e.gia_ck < 0 || (e.gia_ck > 0 && e.gia_ck < 0.5)) ? Math.abs(Math.round(e.gia_ck)) : e.gia_ck;
            e.gia_ck = Math.round(e.gia_ck);

            e.thanh_tien = Math.round(e.gia_ck * e.so_luong);

            e.thanh_toan = (gia_vat_dc * e.so_luong) - e.tien_ck;
            // nếu có ck 09 thì xử lý
            if (e.tien_kb09) {
                e.thanh_toan = e.thanh_toan - e.tien_kb09;
            }
            if (e.tl_ck_sau_vat09) {
                e.thanh_toan = e.thanh_toan - e.tl_ck_sau_vat09;
            }
            // e.thanh_tien = Math.round(e.thanh_toan / (1 + e.thue_suat / 100));
            e.tien_thue = e.thanh_toan - e.thanh_tien;

        });

        serviceUpdate.map((e: Service) => {
            e.gia_ck = e.gia_ban - (e.tien_ck / (1 + (e.thue_suat / 100)));
            e.thanh_tien = Math.round(e.gia_ck * e.so_luong);
            // e.tien_thue = Math.round(e.thanh_tien * e.thue_suat / 100);
            // e.tien_thue = e.thanh_tien * e.thue_suat / 100;
            // e.tong_tien = this.commonService.rouding(e.thanh_tien + e.tien_thue, option);

            /**
             * 2024-05-15: cài đặt công thức tính tổng thanh toán và tiền thuế như sau
             *      tổng thanh toán = giá full vat x số lượng - tiền chiết khấu
             *      thuế = tổng thanh toán - thành tiền
             */
            e.tong_tien = (e.gia_vat * e.so_luong) - e.tien_ck;
            e.tien_thue = e.tong_tien - e.thanh_tien;
            // 2024-05-15: end
        });
    }

    // #endregion convert

    //#region Chiết khấu 09
    calcDiscount09(ticket: any, merchandiseUpdate: any, current_item: any | undefined = null) {
        // Lấy chi tiết chiết khấu loại 09: Chiết khấu theo giá hạng khách hàng
        const discountForMerchandise09 = ticket.discount.filter((e: any) => e.loai_ck === DISCOUNT_TYPE.DISCOUNT_CUSTOMER_RANK && (!current_item || (
            e.ma_imei.trim().toLowerCase() == current_item.ma_imei.trim().toLowerCase()
            && e.ma_vt.trim().toLowerCase() == current_item.ma_vt.trim().toLowerCase()
        )));

        (discountForMerchandise09 as any).forEach((discount: any) => {
            if (discount) {
                let { ma_vt, tien_ck_tv, tl_ck, ma_imei, tien_max, tien_ck, ma_ck } = discount;
                const result = (merchandiseUpdate as any[]).filter((merchandise: any) => this.compareMerchandiseCode(merchandise.ma_vt, ma_vt) && !merchandise.km_yn);

                // Tổng tiền hàng bán của phiếu có trong chiết khấu
                result.forEach((e: Merchandise, index) => {
                    // kiểm tra đúng imei và ma_vt thì gán tien_ck
                    if (e.ma_imei.trim().toLowerCase() == ma_imei.trim().toLowerCase()
                        && e.ma_vt.trim().toLowerCase() == ma_vt.trim().toLowerCase()) {

                        // Sử dụng tl_ck từ e.tl_ck09 nếu tl_ck không tồn tại hoặc không có giá trị
                        const tl_ck_final = tl_ck || e.tl_ck09 || 0;
                        // Sử dụng tien_ck_tv từ e.tien_kb09 nếu tien_ck_tv không tồn tại hoặc không có giá trị
                        const tien_ck_tv_final = tien_ck_tv || e.tien_kb09 || 0;
                        // Sử dụng tien_max từ e.tien_max09 nếu tien_max không tồn tại hoặc không có giá trị
                        const tien_max_final = tien_max || e.tien_max09 || 0;

                        // Trường hợp có tien_ck_tv
                        if (tien_ck_tv_final) {
                            const tien_ck_raw = tien_ck_tv_final / (1 + (e.thue_suat / 100)); // Tính giá trị chưa kiểm tra với tien_max và thue_suat
                            const tien_max_adjusted = tien_max > 0 ? tien_max / (1 + (e.thue_suat / 100)) : tien_ck_raw; // Tính tien_max đã điều chỉnh với thue_suat

                            // Lấy giá trị chiết khấu cuối cùng, không vượt quá tien_max điều chỉnh
                            tien_ck = tien_ck_raw > tien_max_adjusted ? tien_max_adjusted : tien_ck_raw;
                        } else {
                            // Trường hợp không có tien_ck_tv, tính theo tl_ck
                            const tien_ck_raw = e.gia_ck * (tl_ck_final / 100); // Tính giá trị chưa kiểm tra với tien_max
                            const tien_max_adjusted = tien_max_final > 0 ? tien_max_final / (1 + (e.thue_suat / 100)) : tien_ck_raw; // Tính tien_max đã điều chỉnh với thue_suat

                            // Lấy giá trị chiết khấu cuối cùng, không vượt quá tien_max điều chỉnh
                            tien_ck = tien_ck_raw > tien_max_adjusted ? tien_max_adjusted : tien_ck_raw;
                        }

                        // tiền ck add vào phiếu là tiền ck full vat & làm tròn đến 1000đ
                        tien_ck = this.commonService.rouding(tien_ck + ((tien_ck * e.thue_suat) / 100));

                        // tính lại tiền ck 09 trước thuế sau khi làm tròn đến 1000đ
                        const tien_ck09_truoc_vat = Math.round(tien_ck / (1 + (e.thue_suat / 100)));

                        // trừ tiền ck09 vào giá sau ck
                        e.gia_ck -= tien_ck09_truoc_vat;

                        // add ck 09 vào
                        e.tl_ck09 = tl_ck_final;
                        e.tien_kb09 = tien_ck_tv_final;
                        e.tien_max09 = tien_max_final;
                        e.tien_ck09 = tien_ck ? tien_ck : 0;
                        e.tl_ck_sau_vat09 = tl_ck_final ? tien_ck : 0;
                    }
                });

                // update lại tien_ck tab ck cho loại 09
                const discountUpdate = ticket.discount.find((x: any) => x.ma_ck == ma_ck && x.ma_imei == ma_imei && x.ma_vt == ma_vt);
                discountUpdate.tien_ck = tien_ck || 0;
                discountUpdate.tien_ck_nt = tien_ck || 0;
            }
        });
    }

    //#endregion
}
