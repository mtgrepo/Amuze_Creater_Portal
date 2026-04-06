// types/authorReport.ts
export interface ProductDetail {
    productTitleId: number | null;
    productTitleName: string;
    productSeasonId: number | null;
    productSeasonName: string | null;
    productEpisodeId: number | null;
    productEpisodeName: string | null;
}

export interface AuthorReportResponseDetails {
    transactionId: number;
    catetoryId: number;     // Match API typo
    catetoryName: string;   // Match API typo
    productPrice: number;
    productId: number;
    buyerId: number;
    buyerName: string;
    authorId: number;
    authorName: string;
    profitPercent: number;
    authorIncome: number;
    purchaseDate: string;
    productDetail: ProductDetail; // Singular as per API
}

export interface AuthorReportResponse {
    status: boolean;
    message: string;
    data: {
        reports: {
            [key: string]: AuthorReportResponseDetails[];
        };
    };
}

export type ReportFilters = {
    startDate: string;
    endDate: string;
    category: string;
};