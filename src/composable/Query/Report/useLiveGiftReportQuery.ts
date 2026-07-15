import { useQuery } from "@tanstack/react-query";
import { getLiveGiftReport } from "@/http/apis/report/liveGiftReportApi";
import type { GiftReportResponse, LiveGiftReportParams } from "@/types/response/report/liveGiftReportResponse";

export const useLiveGiftReportQuery = (params: LiveGiftReportParams) => {
  const data = useQuery<GiftReportResponse>({
    queryKey: ["authorReport", params.page, params.pageSize],
    queryFn: () => getLiveGiftReport(params.page, params.pageSize)
  });
  return {
    liveGiftList: data?.data,
    total: data?.data?.total ?? 0,
    totalPage: data?.data?.totalPage ?? 0,
    isLoading: data?.isLoading,
    isError: data?.isError,
  };
};
