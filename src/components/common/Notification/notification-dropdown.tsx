import { useEffect, useRef } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreatorNoti } from "./notificationContext";
import CreatorNotiItem from "./notificationItems";
import { useNavigate } from "react-router-dom";
import { getNotificationRoute } from "./notification-routes";

const CreatorNotiDropdown = () => {
  const {
    notifications,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    unreadCount,
    isDropdownOpen,
    handleMarkAsRead,
    handleMarkAllAsRead,
    closeDropdown,
  } = useCreatorNoti();

  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        closeDropdown();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside); // Cleanup
  }, [closeDropdown]);


  const handleNotificationItem = (noti: any) => {
    handleMarkAsRead(noti.id);
    navigate(getNotificationRoute(noti.data.type, noti.data));

    closeDropdown();
  };

  if (!isDropdownOpen) return null;
  return (
    <div
      ref={ref}
      className="absolute right-0 top-12 z-50 w-80 rounded-xl border bg-background shadow-lg "
    >
      <div className="flex items-center justify-between border-b px-4 py-3">
        <span className="font-semibold text-sm">
          Notifications {unreadCount > 0 && `(${unreadCount})`}
        </span>
        {unreadCount > 0 && (
          <div className="flex items-center gap-2">
            <Checkbox id="mark-all"
              onCheckedChange={handleMarkAllAsRead}
            />
            <label
              htmlFor="mark-all"
              className="text-sm cursor-pointer select-none"
            >
              Mark all as read
            </label>
          </div>
        )}
      </div>


      <div className="h-80 overflow-y-auto" >
        <div className="flex flex-col">
          {notifications.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">
              No notifications
            </p>
          ) : (
            notifications.map((noti) => (
              <CreatorNotiItem
              key={noti.id}
              notifications={noti}
              onClick={() => handleNotificationItem(noti)}
            />
            ))
          )}

          {hasNextPage && (
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="w-full py-2 text-sm text-blue-500 hover:underline"
            >
              {isFetchingNextPage ? "Loading..." : "Load more..."}
            </button>
          )}

        </div>
      </div>

    </div>
  );
};

export default CreatorNotiDropdown;
