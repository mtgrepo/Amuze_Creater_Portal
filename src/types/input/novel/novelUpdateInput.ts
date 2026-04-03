export interface NovelUpdateInput {
    name: string;
    description: string;
    price: number;
    genres: number[]; // Assuming generes are represented as an array of genre IDs
}