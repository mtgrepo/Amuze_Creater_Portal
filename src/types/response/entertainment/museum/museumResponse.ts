
export interface Museum{
    id: number;
    name: string;
    description: string;
    thumbnail?:string;
    horizontal_thumbnail: string;
    likes: number;
    views: number;
    ratings: number;
    approve_status: number;
    is_publish: boolean;
    museum_title?: MuseumTitle[];
    created_at?: Date | null;
    createdUser: {id: number; name: string}
}

export interface MuseumTitle{
    id: number;
    name: string;
    thumbnail: string;
    approve_status: number;
    created_at?: Date | null;
}

export interface MuseumResponseType {
    data?: Museum[];
    total: number;
    totalPage: number;
}

export interface MuseumDetailResponse{
 status: boolean;
 message: string;
 data: Museum   
}

