import { Discount, GiveMerchandiseDiscountDetail, DiscountForCustomerDetail, DiscountRequest, DiscountForMerchandiseDetail, DiscountForTicketDetail, DISCOUNT_TYPE } from '@app/sales-management/model/ticket/common-model/discount.model';
import { CommonService } from './common.service';
import { Injectable } from '@angular/core';
import { Merchandise } from '@app/sales-management/model/ticket/retail/model';


@Injectable({
    providedIn: 'root'
})
export class DiscountService {

    constructor(private commonService: CommonService) { }

    compareMerchandiseCode(val1: string, val2: string) {
        return val1.replace(/\s+/g, '') === val2.replace(/\s+/g, '');
    }

    getMoneyOfDiscountForCustomer(ma_kh: string, discounts: Discount[]): any {
        const discountsValid = discounts.filter(discount => {
            discount.ma_ck === DISCOUNT_TYPE.REDUTION_FOR_CUSTOMER &&
                (discount.details[0] as DiscountForCustomerDetail).ma_kh === ma_kh;
        });
        const totalMoney = discountsValid.map(discount => {
            const detail = discount.details[0] as DiscountForCustomerDetail;
            return detail.tien_ck ? detail.tien_ck : detail.tien_ck_tl;
        }).reduce((pre, cur) => pre + cur, 0);

        return { money: totalMoney, discounts: discountsValid };
    }

    getMoneyOfGiftDiscount(promMerchandise: any, discounts: Discount[]): number | undefined {
        for (const discount of discounts) {
            const details = discount.details as GiveMerchandiseDiscountDetail[];
            for (const detail of details) {
                if (detail.ma_imei === promMerchandise.imei_mua &&
                    (this.compareMerchandiseCode(promMerchandise.ma_vt, detail.ma_vt) ||
                        this.compareMerchandiseCode(promMerchandise.ma_vt, detail.ma_vt_tang))) {
                    return detail.tien_qd;
                }
            }
        }
        return undefined;
    }

    private convertGiftDiscount(discount: any) {


        const rs = new Discount() as any;
        Object.keys(rs).forEach(key => {
            if (discount.hasOwnProperty(key)) {
                rs[key] = discount[key];
            }
        });
        const detail = new GiveMerchandiseDiscountDetail() as any;
        Object.keys(detail).forEach(key => {
            if (discount.hasOwnProperty(key)) {
                detail[key] = discount[key];
            }
        });
        rs.details = [detail];
        (rs.details as any[]).filter(detail => {
            const isExist = (rs.details as GiveMerchandiseDiscountDetail[]).findIndex(e => e.ma_vt_tang === detail.ma_vt_tang);
            return isExist >= 0 ? false : true;
        });
        return rs;
    }

    convertDiscount(discount: Discount) {
        switch (discount.loai_ck) {
            case DISCOUNT_TYPE.GIFT:
                return this.convertGiftDiscount(discount);
            case DISCOUNT_TYPE.REDUTION_BY_MERCHANDISE_CODE:
                return this.convertDiscountForMerchandise(discount);
            case DISCOUNT_TYPE.REDUTION_FOR_CUSTOMER:
                return this.convertDiscountForCustomer(discount);
            case DISCOUNT_TYPE.REDUTION_FOR_TICKET:
                return this.convertDiscountForTicket(discount);
            case DISCOUNT_TYPE.CROSS_SELLING:
                return this.convertDiscountForCrossSelling(discount);
            case DISCOUNT_TYPE.ACCESSORY_COMBO:
                return this.convertDiscountForAccessoryCombo(discount);
            case DISCOUNT_TYPE.SERVICE_DISCOUNT:
              return this.convertDiscountForService(discount);
            default:
                break;
        }
    }

    convertPromotionToDiscount(promotion: Discount[]) {
        const discount = { ...promotion[0] };
        discount.ma_vt_tang = '';
        discount.ma_vt_tt = '';
        discount.ma_vt = '';
        discount.ma_dv = '';
        discount.tien_ck = 0;
        discount.tien_ck_nt = 0;
        discount.tien_qd = promotion.map(item => item.tien_qd).reduce((x, y) => x + y, 0);
        discount.details = promotion;
        return discount;
    }

    addNew(src: Discount[], des: Discount[]) {
        des.push(...src);
        des.map((e, i) => e.line_nbr = i);
    }

    removeDiscount(discountRemoved: Discount[], discounts: Discount[]) {
        discountRemoved.forEach(discount => {
            discounts.splice(discount.line_nbr, 1);
        });
        discounts.map((e, i) => e.line_nbr = i);
    }

    //isGridDiscount: method được gọi từ grid "chiết khấu"
    //isRemoveMerchandise: call method từ hành động xóa hàng hóa trong grid
    resetDiscount(discounts: any[], isGridItem: boolean = false, currentRowitem: Merchandise | null = null,
        isGridDiscount: boolean = false, isRemoveMerchandise = false) {
        let discountKeep = discounts.filter(e => e.loai_ck === DISCOUNT_TYPE.GIFT);

        if (!isGridDiscount) {
            if (isGridItem && currentRowitem && currentRowitem.ma_imei) {
                //Thực hiện gọi tính ck từ item trong grid => loại bỏ ck ngoại giao để thực hiện tính lại
                //đối với các mã ck trong tab chiết khấu có imei áp dụng trùng với imei của dòng đang chọn => giữ lại ck
                let discount_keep_adv = discounts.filter(e => e.loai_ck !== DISCOUNT_TYPE.GIFT);
                discount_keep_adv = discount_keep_adv.filter(e => e.loai_ck !== DISCOUNT_TYPE.REDUTION_FOR_CUSTOMER ||
                    (e.loai_ck === DISCOUNT_TYPE.REDUTION_FOR_CUSTOMER && e.ma_imei && e.ma_imei.trim() !== currentRowitem.ma_imei.trim())
                );
                discountKeep.push(...discount_keep_adv);
            }
            else {
                //Thực hiện gọi tính ck từ button trên form master => giữ lại chiết khấu ngoại giao, tính lại các ck khác
                let discount_keep_adv = discounts.filter(e => e.loai_ck === DISCOUNT_TYPE.REDUTION_FOR_CUSTOMER);

                //Nếu thực hiện xóa dòng trong grid hàng hóa => loại bỏ ck ngoại giao tương ứng với imei đang xóa
                if (isRemoveMerchandise && currentRowitem && currentRowitem.ma_imei) {
                    discount_keep_adv = discount_keep_adv.filter(e => e.ma_imei.trim() !== currentRowitem.ma_imei.trim());
                }

                discountKeep.push(...discount_keep_adv);
            }
        }

        discounts.splice(0, discounts.length);
        discounts.push(...discountKeep);
        discounts.map((e, i) => e.line_nbr = i);

        // const discountRemoved = discounts.filter(e => e.loai_ck !== DISCOUNT_TYPE.GIFT);
        // discountRemoved.forEach(e => {
        //     discounts.splice(e.line_nbr, 1);
        // });
        // discounts.map((e, i) => e.line_nbr = i);
    }

    attachImeiForDiscount(imei_mua: string, discount: Discount) {
        discount.details.map((detail: GiveMerchandiseDiscountDetail) => {
            detail.ma_imei = imei_mua;
        });
        discount.ma_imei = imei_mua;
    }

    getMerchandiseCodeOfPM(discount: Discount): any[] {
        return discount.details.map((detail: GiveMerchandiseDiscountDetail) => {
            return { ma_vt_tang: detail.ma_vt_tang, ma_vt_tt: detail.ma_vt_tt, tien_kmqd: detail.tien_qd, ma_dv: detail.ma_dv, sd_vt_tang: detail.sd_vt_tang, no_km_yn: detail.no_km_yn };
        });
    }

    getMerchandiseCodeOfPMAlter(merchanise: any, discounts: Discount[]): string {
        const discount = discounts.find(discount =>
            discount.loai_ck === DISCOUNT_TYPE.GIFT &&
            this.compareMerchandiseCode(discount.ma_imei, merchanise.imei_mua));
        if (discount) {
            if (this.compareMerchandiseCode(discount.ma_vt_tang, merchanise.ma_vt)) {
                return discount.ma_vt_tt;
            } else if (this.compareMerchandiseCode(discount.ma_vt_tt, merchanise.ma_vt)) {
                return discount.ma_vt_tang;
            }
        }
        return '';
    }

    // getMerchandiseCodeOfPMAlter(merchanise: any, discounts: Discount[]): string {
    //     console.log(discounts);

    //     const discount = discounts.find(discount =>
    //         discount.loai_ck === DISCOUNT_TYPE.GIFT &&
    //         discount.details.length &&
    //         this.compareMerchandiseCode((discount.details)[0].ma_imei, merchanise.imei_mua));
    //     if (discount && discount.details.length) {
    //         for (const detail of discount.details) {
    //             if (this.compareMerchandiseCode(detail.ma_vt_tang, merchanise.ma_vt)) {
    //                 return detail.ma_vt_tt;
    //             } else if (this.compareMerchandiseCode(detail.ma_vt_tt, merchanise.ma_vt)) {
    //                 return detail.ma_vt_tang;
    //             }
    //         }
    //     }
    //     return '';
    // }

    getDiscountsOfMerchandise(ma_imei: string, discounts: Discount[]) {
        const discountValid = discounts.filter(e => e.loai_ck === DISCOUNT_TYPE.GIFT);
        return discountValid.filter(discount =>
            (discount.details && discount.details.length && this.compareMerchandiseCode(discount.details[0].ma_imei, ma_imei)) || this.compareMerchandiseCode(discount.ma_imei, ma_imei)
        );
        return discountValid.filter(discount =>
            discount.details.length && this.compareMerchandiseCode(discount.details[0].ma_imei, ma_imei)
        );
    }

    getDiscountCurrent(discounts: Discount[]) {
        return discounts.filter(discount => discount.loai_ck !== DISCOUNT_TYPE.GIFT);
    }

    // #region calculate discount
    getDiscountsInValid(discountValid: Discount[], discounts: Discount[]) {
        const disCodeList = discountValid.map(e => e.ma_ck);
        return discounts.filter(discount => !disCodeList.includes(discount.ma_ck) && discount.loai_ck !== DISCOUNT_TYPE.GIFT);
    }

    getDiscountsCodeRemovedAndSelected(discountSelected: Discount[], discounts: Discount[]) {
        const discountCodeSelected = discountSelected.map(e => e.ma_ck);
        const discountCurrent = discounts.filter(e => e.loai_ck !== DISCOUNT_TYPE.GIFT);
        const discountCodeCurrent = discountCurrent.map(e => e.ma_ck);
        const discountAdded = discountSelected.filter(disocunt => !discountCodeCurrent.includes(disocunt.ma_ck));
        const disocuntRemoved = discountCurrent.filter(disocunt => !discountCodeSelected.includes(disocunt.ma_ck));
        return { discountAdded, disocuntRemoved };
    }

    convertDiscountForMerchandise(discount: any) {
        if (!discount.items) return null;
        discount.details = [...discount.items];
        discount.tien_ck = discount.details.reduce((pre: any, cur: any) => {
            return pre + (cur.tien_ck || cur.tien_ck_tl);
            //return (typeof pre === 'object' ? (pre.tien_ck || pre.tien_ck_tl || 0) : 0) + (cur.tien_ck || cur.tien_ck_tl);
        }, 0);


        delete discount.items;
        discount.details = (discount.details as any[]).filter((detail, i) => {
            const index = (discount.details as any[]).findIndex(e => e.ma_vt === detail.ma_vt);
            return index >= 0 && index !== i ? false : true;
        });
        return discount;
    }

    convertDiscountForService(discount: any) {
        if (!discount.items) return null;
        discount.details = [...discount.items];
        discount.tien_ck = discount.details[0].tien_ck || discount.details[0].tien_ck_tl;
        delete discount.items;
        discount.details = [discount.details[0]];
        return discount;
    }

    convertDiscountForCustomer(discount: any) {
        if (!discount.items) return null;
        discount.details = [...discount.items];
        discount.tien_ck = discount.details[0].tien_ck || discount.details[0].tien_ck_tl;
        delete discount.items;
        discount.details = [discount.details[0]];
        return discount;
    }

    convertDiscountForTicket(discount: any) {
        if (!discount.items) return null;
        discount.details = [...discount.items];
        discount.tien_ck = discount.details[0].tien_ck || discount.details[0].tien_ck_tl;
        delete discount.items;
        discount.details = [discount.details[0]];
        return discount;
    }

    convertDiscountForCrossSelling(discount: any) {
        if (!discount.items) return null;
        discount.details = [...discount.items];
        // Chiết khấu loại áp dụng trên tổng đơn hàng
        if (discount.type == 0) {
            discount.tien_ck = discount.tien_ck || discount.tien_ck_tl;
            delete discount.items;
        }
        else {
            discount.tien_ck = discount.details.reduce((cur: number, item: any) => {
                return cur += item.tien_ck || item.tien_ck_tl;
            }, 0);
            delete discount.items;
        }
        return discount;
    }
    convertDiscountForAccessoryCombo(discount: any, markerArray?: any[]) {
        if (!discount.items) return null;
        discount.details = [...discount.items];
        // Chiết khấu loại áp dụng trên tổng đơn hàng

        discount.tien_ck = discount.tien_ck || discount.tien_ck_tl || (discount.tien_ck_max && discount.tien_ck_ct > discount.tien_ck_max ? discount.tien_ck_max : discount.tien_ck_ct);
        delete discount.items;

        // if (discount.type == 0) {
        //     discount.tien_ck = discount.tien_ck || discount.tien_ck_tl;
        //     delete discount.items;
        // }
        // else {
        //     // Nếu chiết khấu áp dụng theo chi tiết mặt hàng thì kiểm tra xem có khai báo chiết khấu tối đa không
        //     // ==> Nếu có kiểm tra xem phần chiết khấu có vượt qua không, nếu có thì phải phân bổ theo từng mặt hàng được khai báo
        //     const tien_ck = discount.details.filter((x: any) => x.stt == 1).sort((a: any, b: any) => {
        //         return (b.tien_ck || b.tien_ck_tl) - (a.tien_ck || a.tien_ck_tl);
        //     }).slice(0, discount.sl_nhom).reduce((cur: number, item: any) => {
        //         return cur += item.tien_ck || item.tien_ck_tl;
        //     }, 0);
        //     if (discount.tien_ck_max) {
        //         if (tien_ck > discount.tien_ck_max) {
        //             discount.tien_ck = discount.tien_ck_max;
        //             discount.type = 0;
        //         }
        //         else {
        //             discount.tien_ck = tien_ck;
        //         }
        //     }
        //     else {
        //         discount.tien_ck = tien_ck;
        //     }
        //     delete discount.items;
        // }
        return discount;
    }
    convertDiscountFromList(discounts: any[]) {
        // Mảng này dùng để đánh dấu
        return discounts.map(discount => {
            const convertDiscoint = this.convertDiscount(discount);
            return { ...convertDiscoint, tien_ck_view: convertDiscoint.loai_ck == DISCOUNT_TYPE.ACCESSORY_COMBO ? '' : convertDiscoint.tien_ck };
        }).filter(x => x != null);
    }

    // #region calculate discount

    convertDiscountToRequest = (discounts: any, masterInfo: any) => {
        const result = discounts.map((discount: any) => {
            const newDisccount = new DiscountRequest();
            Object.keys(newDisccount).map((key: string) => {
                if (discount.hasOwnProperty(key)) {
                    (newDisccount as any)[key] = discount[key];
                }
                // else {
                //     if (discount.details && discount.details[0]) {
                //         if (discount.details[0].hasOwnProperty(key)) {
                //             (newDisccount as any)[key] = discount.details[0][key];
                //         }
                //     }
                // }
            });
            return newDisccount;
        }).flat(Infinity);

        this.commonService.updateBaseInfo(masterInfo, result);
        return result;
    };

    // convertDiscountToRequest = (discounts: any, masterInfo: any) => {
    //     const result = discounts.map((discount: any) => {
    //         let rs: DiscountRequest[] = [];
    //         discount.details.map((detail: any) => {
    //             const newDisccount = new DiscountRequest();
    //             Object.keys(newDisccount).map((key: string) => {
    //                 if (discount.hasOwnProperty(key)) {
    //                     (newDisccount as any)[key] = discount[key];
    //                 } else if (detail.hasOwnProperty(key))
    //                     (newDisccount as any)[key] = detail[key];
    //             });
    //             newDisccount.tien_ck_nt = newDisccount.tien_ck;
    //             rs = [...rs, newDisccount];
    //         });
    //         return rs;
    //     }).flat(Infinity);

    //     this.commonService.updateBaseInfo(masterInfo, result);
    //     return result;

    // };

    // #region convert from voucher
    convertDiscountFromVoucher(src: DiscountRequest[], des: Discount[]) {
        const giftDiscount = src.filter(discount => discount.loai_ck === DISCOUNT_TYPE.GIFT);
        const discountForCustomer = src.filter(discount => discount.loai_ck === DISCOUNT_TYPE.REDUTION_FOR_CUSTOMER);
        const discountForMerchandise = src.filter(discount => discount.loai_ck === DISCOUNT_TYPE.REDUTION_BY_MERCHANDISE_CODE);
        const discountForTicket = src.filter(discount => discount.loai_ck === DISCOUNT_TYPE.REDUTION_FOR_TICKET);
        const discountForCrossSelling = src.filter(discount => discount.loai_ck === DISCOUNT_TYPE.CROSS_SELLING);
        const discountForAccessoryCombo = src.filter(discount => discount.loai_ck === DISCOUNT_TYPE.ACCESSORY_COMBO);

        const giftDiscountNew = this.handleConvertDiscountFromVoucher(giftDiscount, GiveMerchandiseDiscountDetail);
        const discountForCustomerNew = this.handleConvertDiscountFromVoucher(discountForCustomer, DiscountForCustomerDetail);
        const discountForMerchandiseNew = this.handleConvertDiscountFromVoucher(discountForMerchandise, DiscountForMerchandiseDetail);
        const discountForTicketNew = this.handleConvertDiscountFromVoucher(discountForTicket, DiscountForTicketDetail);
        const discountForCrossSellingNew = this.handleConvertDiscountFromVoucher(discountForCrossSelling, DiscountForMerchandiseDetail);
        const discountForAccessoryComboNew = this.handleConvertDiscountFromVoucher(discountForAccessoryCombo, DiscountForMerchandiseDetail);

        if (giftDiscountNew) {
            des.push(...giftDiscountNew);
        }
        if (discountForCustomerNew) {
            des.push(...discountForCustomerNew);
        }
        if (discountForMerchandiseNew) {
            des.push(...discountForMerchandiseNew);
        }
        if (discountForTicketNew) {
            des.push(...discountForTicketNew);
        }
        if (discountForCrossSellingNew) {
            des.push(...discountForCrossSellingNew);
        }
        if (discountForAccessoryComboNew) {
            des.push(...discountForAccessoryComboNew);
        }
        des.map((e, i) => { e.line_nbr = i; });
    }

    handleConvertDiscountFromVoucher(discounts: DiscountRequest[], TCreator: { new(): any }) {
        if (!discounts.length) {
            return;
        }
        const result: Discount[] = [];
        discounts.forEach(item => {
            const discount = new Discount;
            Object.keys(discount).map(key => {
                if (item.hasOwnProperty(key)) {
                    (discount as any)[key] = (item as any)[key];
                }
            });
            result.push(discount);
        });
        // console.log(discounts);

        // result.details = [];
        // Object.keys(result).map(key => {
        //     if (discounts[0].hasOwnProperty(key)) {
        //         (result as any)[key] = (discounts[0] as any)[key];
        //     }
        // });
        // console.log(result);

        // discounts.forEach(discount => {
        //     const detail = new TCreator();
        //     Object.keys(detail).map(key => {
        //         if (discount.hasOwnProperty(key)) {
        //             (detail as any)[key] = (discount as any)[key];
        //         }
        //     });
        //     result.details.push(detail);
        // });
        return result;
    }
    // #endregion convert from voucher
}




