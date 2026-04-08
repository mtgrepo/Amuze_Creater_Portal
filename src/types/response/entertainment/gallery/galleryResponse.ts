export interface GalleryResponse {
    id: number,
    name: string,
    description: string,
    thumbnail: string,
    preview_file: string,
    price: number,
    likes: number,
    views: number,
    age_rating: number,
    rating: number,
    created_at: Date,
    createdByUser: {
        id: number,
        name: string
    },
    is_published: boolean,
    approve_status: number,
    approved_by: number,
    generes: {
        id: number,
        name: string,
        name_eng: string
    }[],
    isAvailablePurchase: boolean,
    purchaseGalleryByUser: {
        id: number,
        name: string
    }[]
}

export interface Gallery {
    galleries: GalleryResponse[],
    Total: number,
    TotalPages: number
}
