export interface PostResponse {
  id: number;
  user_id: number;
  description: string | null;
  media: MediaResponseType[];
  visibility: string;
  like_count: number;
  comment_count: number;
  views: number;
  created_at: string;
  banned_by: number | null;
  banned_at: string;
  unbanned_at: string;
  ban_reason: string;
  is_banned: boolean;
  user: {
    id: number;
    name: string;
    profile: string | null;
  };
  bannedByUser: {
    id: number;
    name: string;
  } | null;
}

export interface MediaResponseType {
  alt: string;
  url: string;
  type: string;
  index: number;
}

export interface PostResponseType {
  status: boolean;
  message: string;
  data?: {
    updatedPosts: PostResponse[];
    total?: number;
  totalPage?: number;
  };
}

export interface PostDetailResponseType{
   status: boolean;
  message: string;
  data?: PostResponse;
}
