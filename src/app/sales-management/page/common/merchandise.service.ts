
import { ImeiApiService } from '@app/sales-management/api/imei-api.service';
import { DISCOUNT_TYPE, Discount } from '@app/sales-management/model/ticket/common-model/discount.model';
import { CommonService } from './common.service';
import { Injectable } from '@angular/core';
import { Merchandise } from '@app/sales-management/model/ticket/retail/model';
import { Service } from '@app/sales-management/model/ticket/common-model/service.model';
import { Option } from '@app/sales-management/model/ticket/common-model/option.model';



@Injectable({
    providedIn: 'root'
})
export class MerchandiseService {

    constructor(
        private imeiApiService: ImeiApiService,
        private commonService: CommonService
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
        merchandiseNew.line_nbr = merchandises.length;
        //giá niêm yết (s4)
        merchandiseNew.s4 = merchandise.s4;
        //giá điều chỉnh(s5)
        merchandiseNew.s5 = 0;
        //imei xuất bán
        merchandiseNew.gc_td1 = merchandise.gc_td1;
        merchandiseNew.ma_td3 = merchandise.ma_cttc;
        merchandises.push(merchandiseNew);
    }

    removeMerchandise(item: any, merchandises: any[]) {
        merchandises.splice(Number(item.line_nbr) - 1, 1);
        merchandises.map((e, i) => e.line_nbr = i + 1);
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
            merchandiseMain.thanh_tien = Math.round(merchandiseMain.gia_ck * merchandiseMain.so_luong);
            // merchandiseMain.tien_thue = this.commonService.rouding(merchandiseMain.thanh_tien * merchandiseMain.thue_suat / 100, option_thue);
            merchandiseMain.thanh_toan = (merchandiseMain.gia_vat * merchandiseMain.so_luong) - merchandiseMain.tien_ck;
            merchandiseMain.tien_thue = merchandiseMain.thanh_toan - merchandiseMain.thanh_tien;
            const discount = discounts.find(x => {
                return x.ma_imei && merchandise.imei_mua && x.ma_imei.trim() == merchandise.imei_mua.trim();
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

        // Lấy chi tiết chiết khấu loại 01: Chiết khấu giá trị theo mã vật tư để cộng vào chi tiết chiết khấu
        const discountForMerchandise01 = ticket.discount.filter((e: any) => e.loai_ck === DISCOUNT_TYPE.REDUTION_BY_MERCHANDISE_CODE);
        (discountForMerchandise01 as any).forEach((discount: any) => {
            if (discount.details) {
                discount.details.forEach((detail: any) => {
                    const { ma_vt, tien_ck, tien_ck_tl } = detail;
                    const result = (merchandiseUpdate as any[]).filter((merchandise: any) => this.compareMerchandiseCode(merchandise.ma_vt, ma_vt) && !merchandise.km_yn);

                    // Tổng tiền hàng bán của phiếu có trong chiết khấu
                    const t_tien = result.map(e => e.gia_ban * e.so_luong).reduce((pre: any, cur: any) => pre + cur, 0);
                    let total = 0;
                    result.forEach((e: Merchandise, index) => {
                        if (index === merchandiseUpdate.length - 1) {
                            e.tien_ck += detail.tien_ck - total;
                        } else {
                            const money = this.commonService.rouding((e.gia_ban * e.so_luong / t_tien) * detail.tien_ck);
                            e.tien_ck += money;
                            total += money;
                        }
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
                    const { ma_dv } = detail;
                    const result = (serviceUpdate as any[]).filter((service: any) => this.compareMerchandiseCode(service.ma_dv, ma_dv) && !service.km_yn);

                    // Tổng tiền dịch vụ của phiếu có trong chiết khấu
                    const t_tien = result.map(e => e.gia_ban * e.so_luong).reduce((pre: any, cur: any) => pre + cur, 0);
                    let total = 0;
                    result.forEach((e: Service, index) => {
                        if (index === serviceUpdate.length - 1) {
                            e.tien_ck += detail.tien_ck - total;
                        } else {
                            const money = this.commonService.rouding((e.gia_ban * e.so_luong / t_tien) * detail.tien_ck);
                            e.tien_ck += money;
                            total += money;
                        }
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

            //Xử lý làm tròn giá ck sau khi trừ bị âm hoặc trong khoảng 0-0.49
            e.gia_ck = (e.gia_ck < 0 || (e.gia_ck > 0 && e.gia_ck < 0.5)) ? Math.abs(Math.round(e.gia_ck)) : e.gia_ck;

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

    convertFromVoucher(src: any[], des: any[], TCreator: { new(): any; }) {
        const result = src.map(merchandise => {
            const rs = this.createNewMerchandise(merchandise, TCreator);
            rs.gia_ban = merchandise.gia_ban || merchandise.gia_ban_nt || merchandise.gia_nt;
            rs.gia_ck = merchandise.gia_ck || merchandise.gia_ck_nt;
            rs.tien_ck = merchandise.ck || merchandise.ck_nt;
            rs.thanh_tien = merchandise.tien2 || merchandise.tien_nt2 || merchandise.tien_nt;
            rs.tien_thue = merchandise.thue || merchandise.thue_nt;
            rs.thanh_toan = merchandise.tt || merchandise.tt_nt;
            rs.stt_rec_dh = merchandise.stt_rec_dh;

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
                    const { ma_vt, tien_ck, tien_ck_tl } = detail;
                    const result = (merchandiseUpdate as any[]).filter((merchandise: any) => this.compareMerchandiseCode(merchandise.ma_vt, ma_vt) && !merchandise.km_yn);

                    // Tổng tiền hàng bán của phiếu có trong chiết khấu
                    const t_tien = result.map(e => e.gia_ban * e.so_luong).reduce((pre: any, cur: any) => pre + cur, 0);
                    let total = 0;
                    result.forEach((e: Merchandise, index) => {
                        if (index === merchandiseUpdate.length - 1) {
                            e.tien_ck += detail.tien_ck - total;
                        } else {
                            const money = this.commonService.rouding((e.gia_ban * e.so_luong / t_tien) * detail.tien_ck);
                            e.tien_ck += money;
                            total += money;
                        }
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
                    const { ma_dv } = detail;
                    const result = (serviceUpdate as any[]).filter((service: any) => this.compareMerchandiseCode(service.ma_dv, ma_dv) && !service.km_yn);

                    // Tổng tiền dịch vụ của phiếu có trong chiết khấu
                    const t_tien = result.map(e => e.gia_ban * e.so_luong).reduce((pre: any, cur: any) => pre + cur, 0);
                    let total = 0;
                    result.forEach((e: Service, index) => {
                        if (index === serviceUpdate.length - 1) {
                            e.tien_ck += detail.tien_ck - total;
                        } else {
                            const money = this.commonService.rouding((e.gia_ban * e.so_luong / t_tien) * detail.tien_ck);
                            e.tien_ck += money;
                            total += money;
                        }
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
                    const { ma_vt, tien_ck, tien_ck_tl } = detail;
                    const result = (merchandiseUpdate as any[]).filter((merchandise: any) => this.compareMerchandiseCode(merchandise.ma_vt, ma_vt) && !merchandise.km_yn);

                    // Tổng tiền hàng bán của phiếu có trong chiết khấu
                    const t_tien = result.map(e => e.gia_ban * e.so_luong).reduce((pre: any, cur: any) => pre + cur, 0);
                    let total = 0;
                    result.forEach((e: Merchandise, index) => {
                        if (index === merchandiseUpdate.length - 1) {
                            e.tien_ck += detail.tien_ck - total;
                        } else {
                            const money = this.commonService.rouding((e.gia_ban * e.so_luong / t_tien) * detail.tien_ck);
                            e.tien_ck += money;
                            total += money;
                        }
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
                    const { ma_dv } = detail;
                    const result = (serviceUpdate as any[]).filter((service: any) => this.compareMerchandiseCode(service.ma_dv, ma_dv) && !service.km_yn);

                    // Tổng tiền dịch vụ của phiếu có trong chiết khấu
                    const t_tien = result.map(e => e.gia_ban * e.so_luong).reduce((pre: any, cur: any) => pre + cur, 0);
                    let total = 0;
                    result.forEach((e: Service, index) => {
                        if (index === serviceUpdate.length - 1) {
                            e.tien_ck += detail.tien_ck - total;
                        } else {
                            const money = this.commonService.rouding((e.gia_ban * e.so_luong / t_tien) * detail.tien_ck);
                            e.tien_ck += money;
                            total += money;
                        }
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

            //Xử lý làm tròn giá ck sau khi trừ bị âm hoặc trong khoảng 0-0.49
            e.gia_ck = (e.gia_ck < 0 || (e.gia_ck > 0 && e.gia_ck < 0.5)) ? Math.abs(Math.round(e.gia_ck)) : e.gia_ck;
            e.gia_ck = Math.round(e.gia_ck);

            e.thanh_toan = (gia_vat_dc * e.so_luong) - e.tien_ck;
            e.thanh_tien = Math.round(e.thanh_toan / (1 + e.thue_suat / 100));
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
}
