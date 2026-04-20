import { useQuery } from "@tanstack/react-query";
import { getCourseById } from "../../../../../http/apis/entertainment/education/courseApi";
import type { CourseDetailsResponse } from "../../../../../types/response/entertainment/education/gradeResponse";

export const useCourseDetailsQuery = (courseId: number) => {
    const courseDetails = useQuery<CourseDetailsResponse>({
        queryKey: ["courseDetails", courseId],
        queryFn: async () => {
            const res = await getCourseById(courseId);
            return res?.data;
        },
    })
    return {
        courseDetails: courseDetails.data,
        isLoading: courseDetails.isLoading
    }
}