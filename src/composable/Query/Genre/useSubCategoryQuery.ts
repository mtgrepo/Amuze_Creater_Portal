import { useQuery } from "@tanstack/react-query"
import { getSubCategory } from "../../../http/apis/genres/subCategoryApi"

export const useSubCategoryQuery = () => {
    const subCategoryList = useQuery({
        queryKey: ["subCategory"],
        queryFn: async () => {
            const res = await getSubCategory();
            return res?.data;
        }
    })
    return {
        subCategoryList: subCategoryList.data,
        isLoading: subCategoryList.isLoading,
        isError: subCategoryList.isError,
    }
}