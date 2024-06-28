import { Injectable } from "@angular/core";
import { CustomerApiService } from "@app/sales-management/api/customer-api.service";
import { TicketApiService } from "@app/sales-management/api/ticket-api.service";
import { TICKET_CODE, TICKET_ENTITY } from "@app/sales-management/model/common/ticket-code.model";
import { MasterInfo, Merchandise, ContractTicketCreate, TAB_NAME } from "@app/sales-management/model/ticket/contract/model";
import { CommonService } from "../common/common.service";
import { MerchandiseService } from "../common/merchandise.service";
import { VoucherDto } from "@app/sales-management/model/ticket/common-model/voucher.dto.model";

@Injectable({
    providedIn: 'root'
})
export class ContractService {
    isNeedCalcDiscount: boolean = true;
    ticket!: ContractTicketCreate;

    constructor(
        private customerApiService: CustomerApiService,
        private ticketApiService: TicketApiService,
        private commonService: CommonService,
        private merchandiseService: MerchandiseService,
    ) {

    }

    //#region setter
    setTicket(ticket: ContractTicketCreate) {
        this.ticket = ticket;
    }

    // #region init
    loadData(data: VoucherDto) {
        const { masterInfo } = data
        this.ticket.masterInfo = this.commonService.convertMasterInfoFromVoucher(masterInfo, MasterInfo);
        this.customerApiService.getOneById(data.masterInfo.ma_kh).subscribe(result => {
            const customer = result.result as any;
            this.ticket.masterInfo.ten_kh = customer.ten_kh;
            this.ticket.masterInfo.dia_chi = customer.dia_chi;
        });

        data.details.forEach(e => {
            switch (e.name) {
                case TAB_NAME.MERCHANDISE:
                    (e.data as any[]).forEach(data => this.merchandiseService.addNew(data, this.ticket.merchandise, Merchandise));
                    break;
                default:
                    break;
            }
        })
    }

    initTicket(ticket: ContractTicketCreate) {
        const userJson = localStorage.getItem('user');
        const userObj = userJson !== null && JSON.parse(userJson)

        ticket.masterInfo.ma_ct = TICKET_CODE.RETAIL;
        ticket.masterInfo.ma_cuahang = userObj['shop']
        ticket.masterInfo.status = "0";
        ticket.masterInfo.ma_ca = userObj['shift'];
        ticket.masterInfo.ngay_ct = Date();
        ticket.masterInfo.ma_nv = userObj['username']
        ticket.masterInfo.ma_dvcs = userObj['unit']
        this.ticketApiService.getVoucherNumber(TICKET_ENTITY.RETAIL).subscribe(result => {
            ticket.masterInfo.so_ct = result.result as any;
        })
    }

}