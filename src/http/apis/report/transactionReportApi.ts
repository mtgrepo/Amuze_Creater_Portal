export interface TransactionReportParams {
    page: number,
    pageSize: number,
    authorId: number,
    fromDate?: Date,
    toDate?: Date,
    type?: string,
    subCategoryId?: number,
    productId?: number
}