export interface JournalResponse {
    id: number,
    name: string,
    description: string,
    thumbnail: string,
    horizontal_thumbnail: string,
    price: number,
    likes: number,
    views: number,
    preview: number,
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
    }[]
}