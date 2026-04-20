export interface MuseumTitleDetailResponseType {
    status: boolean;
    message: string;
    data? : MuseumTitleDetailResponse
}

export interface MuseumTitleDetailResponse {
    id: number;
    museum_id: number;
    name: string;
    description: string;
    thumbnail: string;
    approve_status: number;
    museum_episodes: MuseumEpisode[];
    createdUser: {id: number; name: string};
    likes: number;
    views:number;
    ratings: number;
}

export interface MuseumEpisode{
    id: number;
    name: string;
    thumbnail: string;
    approve_status: number;
    is_publish: boolean;
    likes: number;
    views: number;
    created_at?: Date | null;
}