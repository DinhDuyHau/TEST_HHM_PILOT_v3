import button from '@app/_common/button';
import { Button } from '@app/_components/gridV2/grid.model';

export const MODE = {
    CREATE: 0,
    UPDATE: 1,
    VIEW: 2
};

export interface TypeVoucher {
    sysid: string,
    title: string,
    voucherCode: string,
    field: string,
    field_detail: string,
    button: Button[],
    [key: string]: any,
    reuse: boolean
}

export const VOUCHER_TYPE = {
    PROPOSEDPURCHASE: {
        reuse: true,
        sysid: 'PR3Tran',
        voucherCode: 'PR3',
        title: 'Phiếu đề nghị xin hàng',
        field: 'proposed-purchase',
        field_detail: 'proposed-purchase_detail',
        button: [button.AddButton, button.ViewButton, button.EditButton, button.DeleteButton, button.PrintButton, button.RefreshButton]
    },
    RECEIPT: {
        reuse: true,
        sysid: 'PVTran',
        voucherCode: 'PNA',
        title: 'Phiếu nhập kho',
        field: 'receipt',
        field_detail: 'receipt_detail',
        button: [button.ViewButton, button.EditButton, button.DeleteButton, button.PrintButton, button.RefreshButton]
    },
    RECEIPT2: {
        reuse: true,
        sysid: 'PVTran2',
        voucherCode: 'PNA',
        title: 'Phiếu nhập kho 2',
        field: 'receipt2',
        field_detail: 'receipt2_detail',
        button: [button.PrintButton, button.RefreshButton]
    },
    STOCK_TRANFER: {
        reuse: true,
        sysid: 'ITTran',
        voucherCode: 'PXB',
        title: 'Phiếu xuất điều chuyển',
        field: 'stock-tranfer',
        field_detail: 'stock-tranfer_detail',
        button: [button.ViewButton, button.EditButton, button.DeleteButton, button.PrintButton, button.RefreshButton]
    },
    STOCK_TRANFER_IN: {
        reuse: true,
        sysid: 'IPTran',
        voucherCode: 'PNF',
        title: 'Phiếu nhập điều chuyển',
        field: 'stock-tranfer-in',
        field_detail: 'stock-tranfer-in_detail',
        button: [button.ViewButton, button.EditButton, button.PrintButton, button.RefreshButton]
    },
    INTERNAL_PURCHASE: {
        reuse: true,
        sysid: 'IPNTran',
        voucherCode: 'PNN',
        title: 'Phiếu nhập mua nội bộ',
        field: 'internal-purchase',
        field_detail: 'internal-purchase_detail',
        button: [button.ViewButton, button.EditButton, button.PrintButton, button.RefreshButton]
    },
    INTERNAL_SALE: {
        reuse: true,
        sysid: 'ITNTran',
        voucherCode: 'PXN',
        title: 'Phiếu xuất bán nội bộ',
        field: 'internal-sale',
        field_detail: 'internal-sale',
        button: [button.ViewButton, button.EditButton, button.DeleteButton, button.PrintButton, button.RefreshButton]
    },
    EVENT_GIFT: {
        reuse: true,
        sysid: 'ISTran_PXK',
        voucherCode: 'PXK',
        title: 'Phiếu xuất tặng hàng theo sự kiện',
        field: 'event-gift',
        field_detail: 'event-gift_detail',
        button: [button.AddButton, button.ViewButton, button.EditButton, button.DeleteButton, button.PrintButton, button.RefreshButton]
    },
    LOAN_OUT: {
        reuse: true,
        sysid: 'ISTran_PXM',
        voucherCode: 'PXM',
        title: 'Phiếu xuất cho mượn',
        field: 'loan-out',
        field_detail: 'loan-out_detail',
        button: [button.AddButton, button.ViewButton, button.EditButton, button.DeleteButton, button.PrintButton, button.RefreshButton]
    },
    LOAN_RECOVERY: {
        reuse: true,
        sysid: 'IRTran_PNM',
        voucherCode: 'PNM',
        title: 'Phiếu nhập hàng cho mượn',
        field: 'loan-recovery',
        field_detail: 'loan-recovery_detail',
        button: [button.AddButton, button.ViewButton, button.EditButton, button.DeleteButton, button.PrintButton, button.RefreshButton]
    },
    WARRANTY_OUT: {
        reuse: true,
        sysid: 'ISTran_PXW',
        voucherCode: 'PXW',
        title: 'Phiếu xuất đi bảo hành',
        field: 'warranty-out',
        field_detail: 'warranty-out_detail',
        button: [button.AddButton, button.ViewButton, button.EditButton, button.DeleteButton, button.PrintButton, button.RefreshButton]
    },
    WARRANTY_IN: {
        reuse: true,
        sysid: 'IRTran_PNW',
        voucherCode: 'PNW',
        title: 'Phiếu nhập bảo hành',
        field: 'warranty-in',
        field_detail: 'warranty-in_detail',
        button: [button.AddButton, button.ViewButton, button.EditButton, button.DeleteButton, button.PrintButton, button.RefreshButton]
    },
    RECOMMENT_TO_USE: {
        reuse: true,
        sysid: 'RUTran',
        voucherCode: 'PR5',
        title: 'Phiếu xuất xuất dùng',
        field: 'recomment-to-use',
        field_detail: 'recomment-to-use_detail',
        button: [button.AddButton, button.ViewButton, button.EditButton, button.DeleteButton, button.PrintButton, button.RefreshButton]
    },
    RETURN_SUPPILER: {
        reuse: true,
        sysid: 'RPTran',
        voucherCode: 'PR4',
        title: 'Phiếu xuất trả lại nhà cung cấp',
        field: 'return-supplier',
        field_detail: 'return-supplier_detail',
        button: [button.AddButton, button.ViewButton, button.EditButton, button.DeleteButton, button.PrintButton, button.RefreshButton]
    },
    CLOSE_SHIFT_PAYMENT: {
        reuse: true,
        sysid: 'PCCTran',
        voucherCode: 'PCC',
        title: 'Phiếu chốt ca',
        field: 'close-shift-payment',
        field_detail: 'close-shift-payment_detail',
        button: [button.AddButton, button.ViewButton, button.EditButton, button.DeleteButton, button.PrintButton, button.RefreshButton]
    },
    COLLECTION_RECEIPT: {
        reuse: true,
        sysid: 'PTHTran',
        voucherCode: 'PTH',
        title: 'Phiếu thu hộ',
        field: 'collection-receipt',
        field_detail: 'collection-receipt_detail',
        button: [button.AddButton, button.ViewButton, button.EditButton, button.DeleteButton, button.PrintButton, button.RefreshButton]
    },
    DEBT_RECEIPT: {
        reuse: true,
        sysid: 'DRTran',
        voucherCode: 'PTN',
        title: 'Phiếu thu công nợ',
        field: 'debt-receipt',
        field_detail: 'debt-receipt_detail',
        button: [button.AddButton, button.ViewButton, button.EditButton, button.DeleteButton, button.PrintButton, button.RefreshButton]
    },
    DEPOSIST_RECEIPT: {
        reuse: true,
        sysid: 'PTCTran',
        voucherCode: 'PTC',
        title: 'Phiếu thu tiền cọc',
        field: 'deposist-receipt',
        field_detail: 'deposist-receipt_detail',
        button: [button.AddButton, button.ViewButton, button.EditButton, button.DeleteButton, button.PrintButton, button.RefreshButton]
    },
    DEPOSIST_RETURN_PAYMENT: {
        reuse: true,
        sysid: 'CDTran_PCH',
        voucherCode: 'PCH',
        title: 'Phiếu chi hoàn cọc',
        field: 'deposist-return-payment',
        field_detail: 'deposist-return-payment_detail',
        button: [button.AddButton, button.ViewButton, button.EditButton, button.DeleteButton, button.PrintButton, button.RefreshButton]
    },
    OTHER_PAYMENT: {
        reuse: true,
        sysid: 'OPTran',
        voucherCode: 'PCK',
        title: 'Phiếu chi khác',
        field: 'other-payment',
        field_detail: 'other-payment_detail',
        button: [button.AddButton, button.PrintButton, button.RefreshButton]
    },
    OTHER_RECEIPT: {
        reuse: true,
        sysid: 'ORTran',
        voucherCode: 'PTK',
        title: 'Phiếu thu khác',
        field: 'other-receipt',
        field_detail: 'other-receipt_detail',
        button: [button.AddButton, button.ViewButton, button.EditButton, button.DeleteButton, button.PrintButton, button.RefreshButton]
    },
    OTHER_MONEY_TRANSFER: {
        reuse: true,
        sysid: 'PCCTran',
        voucherCode: 'PCC',
        title: 'Phiếu chuyển tiền ca khác',
        field: 'close-shift-payment',
        field_detail: 'close-shift-payment_detail',
        button: [button.AddButton, button.ViewButton, button.EditButton, button.DeleteButton, button.PrintButton, button.RefreshButton]
    },
    DEPOSIT_BAOKIM: {
        reuse: true,
        sysid: 'CRTran_PTG',
        voucherCode: 'PTG',
        title: 'Phiếu nộp tiền Bảo Kim',
        field: 'deposit-baokim',
        field_detail: 'deposit-baokim_detail',
        button: [button.AddButton, button.ViewButton, button.EditButton, button.DeleteButton, button.PrintButton, button.RefreshButton]
    },
    WITHDRAW_BAOKIM: {
        reuse: true,
        sysid: 'CRTran_PCG',
        voucherCode: 'PCG',
        title: 'Phiếu rút tiền Bảo Kim',
        field: 'withdraw-baokim',
        field_detail: 'withdraw-baokim_detail',
        button: [button.AddButton, button.ViewButton, button.EditButton, button.DeleteButton, button.PrintButton, button.RefreshButton]
    },
};
