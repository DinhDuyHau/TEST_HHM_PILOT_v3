
export const TICKET_TYPE = {
    RETAIL: 0,
    SALE_ONLINE: 1,
    SALE_ONLINE_ECOMMERCE: 2,
    SALE_WHOLE: 3,
    SALE_AFFILIATE: 4,
    SALE_TELECOM: 5,
    SALE_ITINERANT: 6,
    SALE_SERVICE: 7,
    SALE_RETURN: 8,
    SALE_CHANGE: 9,
    SALE_GIFT_REPAY: 10,
    SALE_REPURCHASE: 11,
    SALE_RENEW: 12,
    SALE_CONTRACT: 13,
    SALE_RETURN_SERVICE: 14,
    SALE_RETURN_ONLINE: 15,
    VOUCHER_STOCK_TRANSFER_FROM_SHOP: 16,
    VOUCHER_STOCK_TRANSFER_IN_SHOP: 17,
    VOUCHER_STOCK_SHOP_CHECK: 18,
    STOCK_PROPOSEDPURCHASE: 19,
    STOCK_TRANFER: 20,
    STOCK_TRANFER_IN: 21,
    STOCK_INTERNAL_SALE: 22,
    STOCK_INTERNAL_PURCHASE: 23,
    STOCK_RECOMMENT_TO_USE: 24,
    STOCK_EVENT_GIFT: 25,
    STOCK_LOAN_OUT: 26,
    STOCK_WARRANTY_OUT: 27,
    STOCK_LOAN_RECOVERY: 28,
    STOCK_WARRANTY_IN: 29,
    STOCK_RECEIPT: 30,
    STOCK_RETURN_SUPPILER: 31,
    STOCK_DEBT_RECEIPT: 32,
    STOCK_DEPOSIST_RECEIPT: 33,
    STOCK_COLLECTION_RECEIPT: 34,
    STOCK_OTHER_RECEIPT: 35,
    DEPOSIST_RETURN_PAYMENT: 36,
    CLOSE_SHIFT_PAYMENT: 37,
    OTHER_PAYMENT: 38,

    //xuất đền bù hàng hóa
    STOCK_COMPENSATION: 39,

    //xuất đền bù dịch vụ
    SERVICE_COMPENSATION: 40,

    //chuyển tiền sang ca sau
    TRANSFER_SHIFT_PAYMENT: 41,

    //phiếu mua lại dịch vụ
    SALE_REPURCHASE_SERVICE: 42,

    DEPOSIT_BAOKIM: 43, // nộp tiền qua bảo kim vào VPBank
    WITHDRAW_BAOKIM: 44, // rút tiền qua bảo kim vào VPBank
};


export const CHANGE_DISCOUNT_MODE = {
    ADD: 0,
    REMOVE: 1
};

export const MODE = {
    CREATE: 0,
    UPDATE: 1,
    VIEW: 2
};

export const STATUS_LIST = {
    RETAIL: {
        CREATE: '0',
        COMPLETE: '2'
    },
    SALE_ONLINE: {
        CREATE: '0',
        COMPLETE: '2'
    },
    COMPLETE: {
        CREATE: '0',
        COMPLETE: '2'
    },
    SALE_ONLINE_ECOMMERCE: {
        CREATE: '0',
        COMPLETE: '2'
    },
    SALE_WHOLE: {
        CREATE: '0',
        COMPLETE: '2'
    },
    SALE_AFFILIATE: {
        CREATE: '0',
        COMPLETE: '2'
    },
    SALE_TELECOM: {
        CREATE: '0',
        COMPLETE: '2'
    },
    SALE_ITINERANT: {
        CREATE: '0',
        COMPLETE: '2'
    },
    SALE_SERVICE: {
        CREATE: '0',
        COMPLETE: '2'
    },
    SALE_RETURN: {
        CREATE: '0',
        COMPLETE: '2'
    },
    SALE_RETURN_ONLINE: {
        CREATE: '0',
        COMPLETE: '2'
    },
    SALE_RETURN_SERVICE: {
        CREATE: '0',
        COMPLETE: '2'
    },
    SALE_CHANGE: {
        CREATE: '0',
        COMPLETE: '2'
    },
    SALE_GIFT_REPAY: {
        CREATE: '0',
        COMPLETE: '2'
    },
    SALE_REPURCHASE: {
        CREATE: '0',
        COMPLETE: '2'
    },
    SALE_RENEW: {
        CREATE: '0',
        COMPLETE: '2'
    },
    SALE_CONTRACT: {
        CREATE: '0',
        COMPLETE: '2'
    },
    STOCK_COMPENSATION: {
        CREATE: '0',
        COMPLETE: '2'
    },
    SERVICE_COMPENSATION: {
        CREATE: '0',
        COMPLETE: '2'
    },
    SALE_REPURCHASE_SERVICE: {
        CREATE: '0',
        COMPLETE: '2'
    },
};
