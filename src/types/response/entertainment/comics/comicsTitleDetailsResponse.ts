export interface ComicsTitleDetailsResponse {
    id: number,
    uuid: string,
    name: string,
    description: string,
    price: number,
    likes: number,
    views: number,
    rating: number,
    approve_status: number,
    approve_at: string,
    published_at: string,
    is_publish: boolean,
    thumbnail: string,
    horizontal_thumbnail: string,
    created_at: Date,
    generes: {
        id: number,
        name: string
    }[],
    comic_episodes: {
        id: number,
        name: string,
        price: number,
        views: number,
        thumbnail: string,
        approve_status: number
    }[]
}