import * as React from "react";
import { SidebarInset } from "@/components/ui/sidebar";
import { decryptAuthData } from "@/lib/helper";
import { useDebounce } from "use-debounce";
import { useNotificationsQuery } from "../../composable/Query/Notification/useNotificationsQuery";
import { Input } from "../../components/ui/input";
import { NotificationComponent } from "@/components/Notification/notification_component";

export default function NotificationPage() {
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [search, setSearch] = React.useState("");
  const loginCreator = decryptAuthData(localStorage.getItem("creator")!);
  if (!loginCreator?.creator?.id) {
  throw new Error("Creator ID is missing");
}
  const creatorId = loginCreator?.creator?.id;
  const [debouncedSearch] = useDebounce(search, 700);
  

  const { notificationsList, isLoading } = useNotificationsQuery({
    page,
    pageSize: limit,
    userId: Number(creatorId),
    role_id: Number(loginCreator?.creator?.role_id!),
    is_read: false,
  });

  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handlePaginationChange = (newPage: number, newLimit: number) => {
    setPage(newPage);
    setLimit(newLimit);
  };


  return (
    <SidebarInset>
      <div className="flex flex-1 flex-col gap-4 px-4">
        <div className="w-full mt-5 ">
          <div className="flex flex-row justify-end gap-3">
            <Input
              placeholder="Filter title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="my-6">
            <NotificationComponent
              data={notificationsList?.notifications ?? []}
              total={notificationsList?.total ?? 0}
              totalPages={notificationsList?.totalPage ?? 0}
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
