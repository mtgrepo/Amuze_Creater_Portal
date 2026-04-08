export interface Comment {
    id?: number;
    comment: string;
    is_edit: boolean;
    created_date: Date;
    user: UserInfo;
    reply?: Comment[];
}

export interface UserInfo {
    id?: number;
    name: string;
    profile: string | null; 
}

export interface CommentResponseType{
    status: boolean;
    message: string;
    data?: Comment[];
}

export interface StoreCommentParams {
    type: string;
    contentId: number;
    parentId?:number | null;
    comment:string
}