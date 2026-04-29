import * as React from "react";
import { SidebarInset } from "@/components/ui/sidebar";
import { decryptAuthData } from "@/lib/helper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { useGalleryQuery } from "@/composable/Query/Entertainment/Gallery/useGalleryQuery";
import { GalleryTitleComponent } from "@/components/Entertainment/Gallery/gallery_component";
import { useDebounce } from "use-debounce";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SearchBox from "../../../components/common/search_box";
export default function GalleryMain() {
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [tab, setTab] = React.useState<"all" | "approved" | "published">("all");
  const [search, setSearch] = React.useState("");
  const loginCreator = decryptAuthData(localStorage.getItem("creator")!);
  const creatorId = loginCreator?.creator?.id;
  const [debouncedSearch] = useDebounce(search, 700);
  const navigate = useNavigate();
  // Determine filter params based on active tab
  const queryParams = React.useMemo(() => {
    switch (tab) {
      case "approved":
        return { approve_status: 1 };
      case "published":
        return { is_published: true };
      default:
        return {};
    }
  }, [tab]);

  // Reset page when tab changes
  React.useEffect(() => {
    setPage(1);
  }, [tab]);

  const { galleryList: apiData, isLoading, totalPage: totalPages, total } = useGalleryQuery(creatorId!, {
    page,
    pageSize: limit,
    name: debouncedSearch,
    ...queryParams,
  });

  const handlePaginationChange = (newPage: number, newLimit: number) => {
    setPage(newPage);
    setLimit(newLimit);
  };
  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const { t } = useTranslation();


  return (
    <SidebarInset>
      <div className="flex flex-1 flex-col gap-4 px-4">
        <div className="w-full mt-5 ">
          <div className="flex flex-row justify-end gap-3">
            <SearchBox search={search} setSearch={setSearch} />
            <Button
              size={"sm"}
              className="cursor-pointer"
              onClick={() => navigate("/entertainment/gallery/create")}
            >
              <CirclePlus className="w-4 h-4" />
              {t('create_new_gallery')}
            </Button>
          </div>
          <div className="border border-border p-3 rounded-lg my-3">
            <Tabs
              value={tab}
              onValueChange={(val) =>
                setTab(val as "all" | "approved" | "published")
              }
              className="w-full my-5"
            >
              <TabsList className="w-full grid grid-cols-3" variant={"line"}>
                <TabsTrigger value="all" className="w-full text-center">
                  {t('all')}
                </TabsTrigger>
                <TabsTrigger value="approved" className="w-full text-center">
                  {t('approved')}
                </TabsTrigger>
                <TabsTrigger value="published" className="w-full text-center">
                  {t('published')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all"></TabsContent>
              <TabsContent value="approved" />
              <TabsContent value="published" />
            </Tabs>

            <GalleryTitleComponent
              data={apiData ?? []}
              total={total ?? 0}
              totalPages={totalPages ?? 0}
              page={page}
              limit={limit}
              onPaginationChange={handlePaginationChange}
              isFetching={isLoading}
              search={search}
              onSearchChange={setSearch}
            />
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
