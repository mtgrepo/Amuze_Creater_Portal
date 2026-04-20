export interface GradesResponse {
    id: number,
    name: string,
    is_old_question: boolean,
    approve_status: number,
    thumbnail: string,
    is_published: boolean,
    approved_by : {
        id: number,
        name: string
    },
    created_by: {
        id: number,
        name: string
    },
    created_at: Date
}