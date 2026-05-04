import * as React from "react";
import { SidebarInset } from "@/components/ui/sidebar";
import { decryptAuthData } from "@/lib/helper";
import { useDebounce } from "use-debounce";
import { useNotificationsQuery } from "../../composable/Query/Notification/useNotificationsQuery";
import { NotificationComponent } from "@/components/Notification/notification_component";
import { Button } from "@/components/ui/button";
import { useMarkAllReadCommand } from "@/composable/Command/Notification/useMarkAllReadCommand";
import { CheckCheck } from "lucide-react";
import SearchBox from "../../components/common/search_box";

export default function NotificationPage() {
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [search, setSearch] = React.useState("");

  const [isAllSelected, setIsAllSelected] = React.useState(false);
  // const [selectedRows, setSelectedRows] = React.useState<Notification[]>([]);

  const loginCreator = decryptAuthData(localStorage.getItem("creator")!);

  if (!loginCreator?.creator?.id) {
    throw new Error("Creator ID is missing");
  }

  // const creatorId = loginCreator.creator.id;
  const [debouncedSearch] = useDebounce(search, 700);

  const { notifications, total, isLoading } = useNotificationsQuery({
    page,
    limit,
    // userId: Number(creatorId),
    // role_id: Number(loginCreator.creator.role_id),
    // is_read: false,
  });

  const { markAllReadMutation } = useMarkAllReadCommand();

  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handlePaginationChange = (newPage: number, newLimit: number) => {
    setPage(newPage);
    setLimit(newLimit);
  };

  //stable callback (prevents re-render loop)
  // const handleAllSelectedChange = React.useCallback(
  //   (allSelected: boolean, rows: Notification[]) => {
  //     setIsAllSelected(allSelected);
  //     setSelectedRows(rows);
  //   },
  //   []
  // );

  const handleAllSelectedChange = React.useCallback(
  (allSelected: boolean) => {
    setIsAllSelected(allSelected);
  },
  []
);

  const handleMarkAllRead = async () => {
    // const ids = selectedRows.map((row) => row.id);
    // console.log("Mark as read:", ids);
    await markAllReadMutation();
  };

  return (
    <SidebarInset>
      <div className="flex flex-1 flex-col gap-4 px-4">
        <div className="w-full mt-5">
          <div className="flex flex-row justify-end gap-3">
            <SearchBox search={search} setSearch={setSearch} />

            {isAllSelected && (
              <Button onClick={handleMarkAllRead} variant={'outline'}>
                <CheckCheck className="mr-2 w-4 h-4"/>
                Mark As All Read
              </Button>
            )}
          </div>

          <div className="my-6">
            <NotificationComponent
              data={notifications ?? []}
              total={total}
              page={page}
              limit={limit}
              onPaginationChange={handlePaginationChange}
              isFetching={isLoading}
              search={search}
              onSearchChange={setSearch}
              onAllSelectedChange={handleAllSelectedChange}
            />
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}