export interface NovelCreateInput {
    name: string;
    description: string;
    file_path: File ;
    price: number;
    thumbnail: string;
    horizontal_thumbnail: string;
    age_rating: number;
    preview: number;
    generes: number[];
    created_by: number;
}