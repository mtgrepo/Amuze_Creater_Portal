import { comicsTitleById } from "@/http/apis/entertainment/comics/comicsTitleApi"
import { useQuery } from "@tanstack/react-query"

export const useComicsTitleDetailsQuery = (id: string) => {
    const titleDetails = useQuery({
        queryKey: ["comicsTitleDetails", id],
        queryFn: async () => {
            const res = await comicsTitleById(id);
            console.log("data in qu", res)
            return res?.data;
        },
        enabled: !!id,
    })
    return {
        titleDetails: titleDetails.data,
        isLoading: titleDetails.isLoading,
        error: titleDetails.error,
    }
}