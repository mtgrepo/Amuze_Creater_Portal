import { getMuzeBoxById } from "@/http/apis/entertainment/muzeBox/muzeBoxApi";
import type { MuzeBoxDetailsResponse } from "@/types/response/entertainment/muzeBox/muzeBoxResponse";
import { useQuery } from "@tanstack/react-query";


export const useMuzeBoxTitleDetailsQuery = (muzeBoxId: number) => {
  const titleDetails = useQuery<MuzeBoxDetailsResponse>({
    queryKey: ["muzeBoxTitleDetails", muzeBoxId],
    queryFn: async () => {
      const res = await getMuzeBoxById(muzeBoxId);
    //   console.log("data in qu", res);
      return res?.data;
    },
    enabled: !!muzeBoxId,
  });
  return {
    titleDetails: titleDetails.data,
    isLoading: titleDetails.isLoading,
    error: titleDetails.error,
  };
};
