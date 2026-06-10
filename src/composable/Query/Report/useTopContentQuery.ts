import { getTopContent } from "@/http/apis/report/authorReportApi";
import { useQuery } from "@tanstack/react-query";

export const useTopContentQuery = (params: { type: string }) => {
  const topContentList = useQuery({
    queryKey: ["top-contents", params],
    queryFn: async () => {
      const result = await getTopContent({ type: params?.type });
      return result?.data;
    },
    enabled: !!params,
  });
  return {
    topContentList: topContentList?.data,
    isLoading: topContentList?.isLoading,
    isError: topContentList?.isError,
  };
};
