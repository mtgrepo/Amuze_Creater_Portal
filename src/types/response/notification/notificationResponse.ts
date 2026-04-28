export interface Notification {
    id: number;
    type:string;
    title: string;
    body: string;
    data: {
        titleId: number;
        createdBy: number;
        created_at: string;
    }
    created_at: string;
    reads: [
        {
            is_read: boolean;
            read_at: string;
        }
    ]
}

export interface NotificationResponse {
    notifications: Notification[];
    total: number;
    page: number;
    limit:number;
}