export interface MuzeBoxDetailsResponse {
    id: number,
    name: string,
    description: string,
    price: number,
    likes: number,
    views: number,
    rating: number,
    approve_status: boolean,
    is_publish: boolean,
    thumbnail: string,
    horizontal_thumbnail: string,
    genres: {
        id: number,
        name: string
    }[],
    generes: {
        id: number,
        name: string
    }[],
    createdByUser: {
        id: number,
        name: string
    },
    created_at: Date,
    muze_box_episodes: {
        id: number,
        name: string,
        price: number,
        views: number,
        thumbnail: string,
        approve_status: number,
        is_publish: boolean,
        is_purchase: boolean,
        created_at: Date
    }[]
}

export interface MuzeBoxResponse {
    series: MuzeBoxDetailsResponse[],
    total: number,
    totalPage: number
}