export interface GradesResponse {
    id: number,
    name: string,
    is_old_question: boolean,
    approve_status: number,
    thumbnail: string,
    is_published: boolean,
    approved_by: {
        id: number,
        name: string
    },
    created_by: {
        id: number,
        name: string
    },
    created_at: Date
}

export interface CourseResponse {
    courses: {
        id: number,
        name: string,
        price: number,
        thumbnail: string,
        file_path: string,
        approve_status: number,
        is_published: boolean,
        created_at: Date
    }
}

export interface GradeDetailsResponse {
    grade: {
        id: number,
        name: string,
        is_old_question: boolean,
        approve_status: number,
        thumbnail: string,
        is_published: boolean,
        approved_by: {
            id: number,
            name: string
        },
        created_by: {
            id: number,
            name: string
        },
        created_at: Date,
        courses: CourseResponse[]
    }
}

export interface CourseDetailsResponse {
    id: number,
    name: string,
    views: number,
    price: number,
    isPublished: boolean,
    approveStatus: number,
    createdAt: string,
    thumbnail: string,
    file: string,
    createdBy: {
        id: number,
        name: string
    }

}