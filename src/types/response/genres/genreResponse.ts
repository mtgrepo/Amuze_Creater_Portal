export interface Genres{
    id: number;
    uuid: string;
    name: string;
    color: string;
    sub_category_id: number;
    created_at: Date | null;
    updated_at: Date | null;
    sub_category: {
        id: number;
        name: string;
    }
}