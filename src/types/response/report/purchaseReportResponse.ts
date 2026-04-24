export interface ComicPurchaseReportResponse {
    titleId: number,
    titleName: string,
    description: string,
    likes: number,
    views: number,
    rating: number,
    episodeId: number,
    episodeName: string,
    price: number,
    buyerId: number,
    buyerName: string,
    amount: number,
    buyingWithWallet: number | null,
    buyingWithBonus: number | null,
    created_at: string
}

export interface NovelPurchaseResponse {
    titleId: number,
    titleName: string,
    description: string,
    thumbnail: string,
    likes: number,
    views: number,
    rating: number,
    price: number,
    buyerId: number,
    buyerName: string,
    amount: number,
    buyingWithWallet: number | null,
    buyingWithBonus: number | null,
    created_at: string
}

export interface StoryTellingPurchaseResponse {
    titleId: number,
    titleName: string,
    description: string,
    likes: number,
    views: number,
    rating: number,
    episodeId: number,
    episodeName: string,
    price: number,
    buyerId: number,
    buyerName: string,
    amount: number,
    buyingWithWallet: number | null,
    buyingWithBonus: number | null,
    created_at: string
}

export interface JournalPurchaseResponse {
    titleId: number,
    titleName: string,
    description: string,
    thumbnail: string,
    likes: number,
    views: number,
    rating: number,
    magazineSeasonId: number,
    magazineSeasonName: string,
    magazineEpisodeId: number,
    magazineEpisodeName: string,
    price: number,
    buyerId: number,
    buyerName: string,
    amount: number,
    buyingWithWallet: number | null,
    buyingWithBonus: number | null,
    created_at: string
}

export interface PurchaseResponse {
    finalResult: ComicPurchaseReportResponse[] | NovelPurchaseResponse[] | StoryTellingPurchaseResponse[] | JournalPurchaseResponse[],
    filterPrice: number,
    filterWallet: number,
    filterBonus: number,
    totalPage: number
}