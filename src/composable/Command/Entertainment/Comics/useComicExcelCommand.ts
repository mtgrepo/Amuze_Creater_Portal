import { getTitleExcelExport } from "@/http/apis/entertainment/comics/comicsTitleApi";
import { useMutation } from "@tanstack/react-query";

export const useComicsTitleExportCommand = () => {
  const excelTitleMutation = useMutation({
    mutationKey: ["comicsTitleExcelExport"],
    mutationFn: async () => {
      return await getTitleExcelExport();
    },
  });
  return {
    excelTitleMutation: excelTitleMutation?.mutateAsync,
    isPending: excelTitleMutation?.isPending,
  };
};
