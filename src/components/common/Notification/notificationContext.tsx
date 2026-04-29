import { useAllNotificationMarkAsRead } from "@/composable/Command/Notification/useAllNotificationMarkAsRead";
import { useNotificationMarkAsRead } from "@/composable/Command/Notification/useNotificationMarkAsRead";
import { useInfiniteNotificationsQuery } from "@/composable/Query/Notification/useInfiniteNotificationsQuery";
import { messaging } from "@/firebase";
import { queryClient } from "@/lib/queryClient";
import type { Notification } from "@/types/response/notification/notificationResponse";
import { onMessage } from "firebase/messaging";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

type CreatorNotiContextType = {
  notifications: Notification[];
  unreadCount: number;
  isDropdownOpen: boolean;

  handleMarkAsRead: (id: number) => Promise<void>;
  handleMarkAllAsRead: () => Promise<void>;

  toggleDropdown: () => void;
  closeDropdown: () => void;

  loadMore: () => void;
  hasMore: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => Promise<unknown>;

};

const CreatorNotiContext = createContext<CreatorNotiContextType | null>(null);

export const CreatorNotiProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const limit = 10;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteNotificationsQuery(limit);
  const { updateMarkNotiMutation } = useNotificationMarkAsRead();
  const { updateAllMarkNotiMutation } = useAllNotificationMarkAsRead();

  const notifications =
    data?.pages.flatMap((page) => page?.notifications ?? []) || [];

  const hasMore = hasNextPage;

 const handleMarkAsRead = useCallback(
  async (id: number) => {
    await updateMarkNotiMutation({ id });
  },
  [updateMarkNotiMutation]
);

 const handleMarkAllAsRead = useCallback(async () => {
  const page = data?.pages.length ?? 1;
  await updateAllMarkNotiMutation({ page, limit });
}, [updateAllMarkNotiMutation, data, limit]);

  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Foreground message received:", payload);
    });

    queryClient.invalidateQueries({ queryKey: ["notifications"] });

    return () => unsubscribe();
  }, []);

  const unreadCount = notifications.filter((n) => !n?.reads[0]?.is_read).length;

  const toggleDropdown = useCallback(
    () => setIsDropdownOpen((prev) => !prev),
    [],
  );
  const closeDropdown = useCallback(() => setIsDropdownOpen(false), []);

  return (
    <CreatorNotiContext.Provider
      value={{
        notifications,
        unreadCount,
        isDropdownOpen,
        handleMarkAsRead,
        handleMarkAllAsRead,

        toggleDropdown,
        closeDropdown,

        hasMore,
        loadMore: fetchNextPage,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
      }}
    >
      {children}
    </CreatorNotiContext.Provider>
  );
};

export const useCreatorNoti = () => {
  const context = useContext(CreatorNotiContext);
  if (!context)
    throw new Error("useCreatorNoti must be used within CreatorNotiProvider");
  return context;
};
