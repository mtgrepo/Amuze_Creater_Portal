export interface MuseumEpisode{
    id: number;
    name: string;
    description: string;
    thumbnail: string;
    approve_status: number;
    is_publish: boolean;
    likes: number;
    views: number;
    created_at?: Date | null;
    created_by: number;
    museum_title_id: number;
    files_path: [];
    
}