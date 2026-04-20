import { useQuery } from "@tanstack/react-query"
import { getAllGrades } from "../../../../../http/apis/entertainment/education/gradesApi"

export const useGradesQuery = (params: {authorId: number}) => {
    const gradeList = useQuery({
        queryKey: ["gradeList", params?.authorId],
        queryFn: async () => {
            const res = await getAllGrades(params);
            return res?.data;
        },
        enabled: !!params.authorId
    })
    return {
        gradeList: gradeList.data,
        isLoading: gradeList.isLoading
    }
}