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

  // setUnreadCount: (count: number) => void
  handleMarkAsRead: (id: number) => Promise<void>;
  handleMarkAllAsRead: () => Promise<void>;

  toggleDropdown: () => void;
  closeDropdown: () => void;

  loadMore: () => void;
  hasMore: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => Promise<unknown>;

  novelUnread: number;
  comicUnread: number;
  storyUnread: number;
  magazineUnread: number;
  galleryUnread: number;
  muzeBoxUnread: number;
  educationUnread: number;
  museumUnread: number;
  postUnread: number;
};

const CATEGORY_TYPES: Record<string, string[]> = {
  novel: ["USER LIKED NOVEL"],
  comic: ["USER LIKED COMIC"],
  story: ["USER LIKED STORY"],
  gallery: ["USER LIKED GALLERY"],
  muzeBox: ["USER LIKED MUZEBOX"],
  post: ["USER LIKED POST"],
};

const countUnreadByTypes = (notifications: Notification[], type?: string[]) =>
  notifications.filter((n) => type?.includes(n?.type) && !n.reads[0]?.is_read)
    .length;

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

  const currentPage = data?.pages.length ?? 1;

  const hasMore = hasNextPage;

  const handleMarkAsRead = useCallback(async (id: number) => {
    await updateMarkNotiMutation({ id });
  }, []);

  const handleMarkAllAsRead = useCallback(async () => {
    await updateAllMarkNotiMutation({ page: currentPage, limit });
  }, []);

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

  const novelUnread = countUnreadByTypes(notifications, CATEGORY_TYPES.novel);
  const comicUnread = countUnreadByTypes(notifications, CATEGORY_TYPES.comic);
  const storyUnread = countUnreadByTypes(notifications, CATEGORY_TYPES.story);
  const magazineUnread = countUnreadByTypes(
    notifications,
    CATEGORY_TYPES.magazine,
  );
  const galleryUnread = countUnreadByTypes(
    notifications,
    CATEGORY_TYPES.gallery,
  );
  const muzeBoxUnread = countUnreadByTypes(
    notifications,
    CATEGORY_TYPES.muzeBox,
  );
  const educationUnread = countUnreadByTypes(notifications);
  const museumUnread = countUnreadByTypes(notifications);
  const postUnread = countUnreadByTypes(notifications, CATEGORY_TYPES.post);

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

        novelUnread,
        comicUnread,
        storyUnread,
        magazineUnread,
        galleryUnread,
        muzeBoxUnread,
        educationUnread,
        museumUnread,
        postUnread,
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
