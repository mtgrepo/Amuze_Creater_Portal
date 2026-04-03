export interface NovelDetailsResponse {
    id: number;
    name: string;
    description: string;
    thumbnail: string;
    horizontal_thumbnail: string;
    price: number;
    age_rating: string;
    preview: string;
    file_path: string;
    views: number;
    likes: number;
    rating: number;
    purchased: boolean;
    createdByUser: {
        id: number;
        name: string;
    };
    genres: string[];
    createdAt: string;
}