import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import { ImeiApiService } from '@app/sales-management/api/imei-api.service';
import { MerchandiseApiService } from '@app/sales-management/api/merchandise-api.service';
import { TicketApiService } from '@app/sales-management/api/ticket-api.service';
import { CommonService } from '@app/sales-management/page/common/common.service';
import { MerchandiseService } from '@app/sales-management/page/common/merchandise.service';
import { Language } from '@app/sales-management/page/common/language';
import { VoucherDto } from '@app/sales-management/model/ticket/common-model/voucher.dto.model';
import { Option } from '@app/sales-management/model/ticket/common-model/option.model';
import { MasterInfo, Merchandise, StockTransferInShopTicket, TAB_NAME } from './model/model';
import { STOCK_TRANSFER_IN_SHOP_TICKET_CODE, STOCK_TRANSFER_IN_SHOP_TICKET_ENTITY } from './model/constants';
import { MasterInfoRequest, MerchandiseRequest } from './model/request.model';

@Injectable({
    providedIn: 'root'
})
export class StockTransferInShopService {
    ticket!: StockTransferInShopTicket;
    option!: Option;

    constructor(
        private ticketApiService: TicketApiService,
        private imeiApiService: ImeiApiService,
        private merchandiseApiService: MerchandiseApiService,
        private commonService: CommonService,
        private merchandiseService: MerchandiseService,
    ) {

    }

    //#region setter
    setTicket(ticket: StockTransferInShopTicket, option: Option) {
        this.ticket = ticket;
        this.option = option;
    }

    //#endregion setter

    // #region init
    loadData(data: VoucherDto) {
        this.ticket.masterInfo = this.commonService.convertMasterInfoFromVoucher(data.masterInfo, MasterInfo);

        data.details.forEach(e => {
            switch (e.name) {
                case TAB_NAME.MERCHANDISE:
                    this.merchandiseService.convertFromVoucher(e.data, this.ticket.merchandise, Merchandise);
                    break;
                default:
                    break;
            }
        });

    }

    // create or update
    prepareVoucher(): VoucherDto {
        const voucherDto: VoucherDto = new VoucherDto;
        voucherDto.details = [];
        voucherDto.masterInfo = this.commonService.convertMasterInfo(this.ticket.masterInfo, MasterInfoRequest);
        voucherDto.details = [...voucherDto.details, { id: 1, name: TAB_NAME.MERCHANDISE, data: this.merchandiseService.convertMerchandiseToRequest(this.ticket.merchandise, voucherDto.masterInfo, MerchandiseRequest) }];
        return voucherDto;
    }

    initTicket(ticket: StockTransferInShopTicket) {
        const userJson = localStorage.getItem('user');
        const userObj = userJson !== null && JSON.parse(userJson);
        ticket.masterInfo.fnote2 = '1';
        ticket.masterInfo.ma_ct = STOCK_TRANSFER_IN_SHOP_TICKET_CODE;
        ticket.masterInfo.ma_cuahang = userObj['shop'];
        ticket.masterInfo.ten_cuahang = this.getShopName(ticket.masterInfo.ma_cuahang);
        if (ticket.masterInfo.fnote2 === '1') {
            ticket.masterInfo.ma_cuahang_x = ticket.masterInfo.ma_cuahang;
            ticket.masterInfo.ten_cuahang_x = this.getShopName(ticket.masterInfo.ma_cuahang_x);
        }
        ticket.masterInfo.status = '0';
        ticket.masterInfo.ma_ca = userObj['shift'];
        ticket.masterInfo.ngay_ct = Date();
        ticket.masterInfo.ma_nvbh = userObj['username'];
        ticket.masterInfo.ma_dvcs = userObj['unit'];
        this.ticketApiService.getVoucherNumber(STOCK_TRANSFER_IN_SHOP_TICKET_ENTITY).subscribe(result => {
            ticket.masterInfo.so_ct = result.result as any;
        });
    }

    getShopName(ma_cuahang: string) {
        const shopsInfo = JSON.parse(localStorage.getItem('shop') || "[]");
        return shopsInfo.find((e: any) => e.ma_cuahang === ma_cuahang)?.ten_cuahang || "";
    }

    //#endregion init

    // #region imei
    getImeiInStore(imei: string) {
        return this.imeiApiService.getImeiInStore(imei, this.ticket.masterInfo.ma_cuahang, STOCK_TRANSFER_IN_SHOP_TICKET_CODE);
    }

    getMerchandiseInfo(ma_vt: string) {
        return this.merchandiseApiService.getOneById(ma_vt);
    }

    // #endregion imei

    // #region merchandise
    removeMerchandise(merchandise: Merchandise) {
        this.merchandiseService.removeMerchandise(merchandise, this.ticket.merchandise);
        this.commonService.showMessage(Language.content.Delete_Completed);
    }
    // #endregion merchandise


    //#region other

    // validate ticket before create or update
    validateTicket(ticket: StockTransferInShopTicket): string {
        let message = '';
        if (!ticket.masterInfo.so_ct) {
            message = this.commonService.getMessage('lbl_invalid_so_ct');
        } else if (!ticket.masterInfo.ngay_ct) {
            message = this.commonService.getMessage('lbl_invalid_ngay_ct');
        } else if (!ticket.masterInfo.ma_dvcs) {
            message = this.commonService.getMessage('lbl_invalid_ma_dvcs');
        }
        return message;
    }

    isInvalidForm(masterInfo: MasterInfo) {
        if (!masterInfo.ma_kho || !masterInfo.ma_khox || !masterInfo.ma_cuahang || !masterInfo.ma_cuahang_x) {
            return true;
        }
        return false;
    }

    // #endregion other

    isInvalidMerchandise(items: Merchandise[]): boolean {
        for (const item of items) {
            if (item.so_luong < 0)
                return false;
        }
        return true;
    }

}