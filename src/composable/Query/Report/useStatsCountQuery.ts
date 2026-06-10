import { getStatusCount } from "@/http/apis/report/authorReportApi";
import { useQuery } from "@tanstack/react-query";

export const useStatsCountQuery = () => {
  const statsCount = useQuery({
    queryKey: ["stats-count"],
    queryFn: async () => {
      const result = await getStatusCount();
      return result?.data;
    },
  });
  return {
    statsCount: statsCount?.data,
    isLoading: statsCount?.isLoading,
  };
};
