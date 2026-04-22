import { useQuery } from "@tanstack/react-query"
import { getAllGrades } from "../../../../../http/apis/entertainment/education/gradesApi"

export const useGradesQuery = (params: { authorId: number,approve_status?: number}) => {
    const gradeList = useQuery({
        queryKey: ["gradeList", params?.approve_status, params?.authorId],
        queryFn: async () => {
            const res = await getAllGrades(params);
            return res?.data;
        },
    })
    return {
        gradeList: gradeList.data,
        isLoading: gradeList.isLoading
    }
}