export interface Result<T> {
    success: boolean,
    message: string,
    result: {
        pageIndex: number,
        pageCount: number,
        pageSize: number,
        recordCount: number,
        items: T[]
    }
}
export interface ResultNoPaging<T> {
    success: boolean,
    message: string,
    result: T[]
}

export interface ResultNoPagingCategory<T> {
    success: boolean,
    message: string,
    result: T
}

export interface ResultDetailVoucher<T> {
    success: boolean,
    message: string,
    result: T
}