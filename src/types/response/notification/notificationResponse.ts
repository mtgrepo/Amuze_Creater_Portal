export interface Notification {
    id: number;
    title: string;
    body: string;
    status: string,
    category: string,
    is_Broadcast: boolean,
    title_id: number,
    sent_by: {
        id: number,
        name: string
    }
    is_read: boolean;
    user: {
        id: number,
        name: string,
        role_id: number
    }[],
    createdAt: Date;
}

export interface NotificationResponse {
    notifications: Notification[];
    total: number;
    totalPage: number;
}