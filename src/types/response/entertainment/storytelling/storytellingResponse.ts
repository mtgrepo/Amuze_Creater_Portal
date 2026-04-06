//responses
export interface StoryTellingTitleResponse {
    id?: number;
    uuid: string;
    name: string;
    description: string;
    likes: number;
    views: number;
    rating: number;
    approve_status: number;
    is_publish: boolean;
    thumbnail?: string;
    horizontal_thumbnail?: string | null;
    story_episodes?: StoryEpisodeResponse[];
    createdByUser: { id: number; name: string; } | null;
    generes: Generes[];
    created_at?: Date | null;
}

export interface StoryTellingTitleDetail {
    id?: number;
    uuid: string;
    sub_category_id:number;
    name: string;
    description: string;
    likes: number;
    views: number;
    rating: number;
    approve_status: number;
    is_publish: boolean;
    thumbnail?: string;
    horizontal_thumbnail?: string;
    story_episodes?: StoryEpisodeResponse[];
    createdByUser: { id: number; name: string; } | null;
    generes: Generes[];
    created_at?: Date;
}

export interface StoryTellingTitleDetailResponse{
    status: boolean;
    message: string;
    data: StoryTellingTitleDetail
}

export interface StoryEpisodeResponse {
    id: number;
    name: string;
    price: number | null;
    preview: number | null;
    thumbnail: string;
    approve_status: number | null;
    approved_by: number | null;
    created_by: number | null;
    sorting: number;
    created_at: Date | null;
}

export interface Generes {
    id: number;
    name: string;
}

//payload
export interface UpdateStoryTitlePayload {
  name: string,
  description: string,
  genres: number[]
}