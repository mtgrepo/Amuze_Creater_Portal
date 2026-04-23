import { useEffect, useRef } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreatorNoti } from "./notificationContext";
import CreatorNotiItem from "./notificationItems";

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

  // Load notifications from backend the first time the dropdown opens
  //   useEffect(() => {
  //     if (isDropdownOpen && notifications.length === 0) {
  //       fetchNotifications();
  //     }
  //   }, [isDropdownOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        closeDropdown();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside); // Cleanup
  }, []);

  //   const notificationRoutes = {
  //     NOVEL_CREATED: (d) => `/novels/${d.novelId}`,
  //     COMIC_TITLE_CREATED: (d) => `/comics/${d.titleId}`,
  //     COMIC_EPISODE_CREATED: (d) => `/comics/${d.titleId}/episode/${d.episodeId}`,
  //     STORYTELLING_CREATED: (d) => `/stories/${d.storyId}`,
  //     MAGAZINE_TITLE_CREATED: (d) => `/journal/${d.magazineId}`,
  //     MAGAZINE_EPISODE_CREATED: (d) => `/journal/${d.magazineId}/season/${d.seasonId}/episode/${d.episodeId}`,
  //     GALLERY_CREATED: (d) => `/gallery/${d.galleryId}`,
  //     MUZEBOX_SERIES_CREATED: (d) => `/muzebox/${d.seriesId}`,
  //     MUZEBOX_EPISODE_CREATED: (d) =>
  //       `/muzebox/${d.seriesId}/episode/${d.episodeId}`,
  //     EDUCATION_GRADE_CREATED: (d) => `/grade/${d.gradeId}`,
  //     EDUCATION_COURSE_CREATED: (d) => `/grade/${d.gradeId}/course/${d.courseId}`,
  //     MUSEUM_CREATED: (d) => `/museum/${d.museumId}`,
  //     MUSEUM_TITLE_CREATED: (d) => `/museum/${d.museumId}/title/${d.titleId}`,
  //     MUSEUM_EPISODE_CREATED: (d) =>
  //       `/museum/${d.museumId}/title/${d.titleId}/episode/${d.episodeId}`,
  //     POST_CREATED: (d) => `/posts/${d.postId}`,
  //     KYC_SUBMITTED: (d) => `/user/kyc/info/${d.kycId}`,
  //   };

  const handleNotificationItem = (noti: any) => {
    handleMarkAsRead(noti.id);

    // const route = notificationRoutes?.[noti.type];

    // if (route) {
    //   navigate(route(noti.data));
    // } else {
    //   navigate("/");
    // }
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

          {notifications.map((noti) => (
            <CreatorNotiItem
              key={noti.id}
              notifications={noti}
              onClick={() => handleNotificationItem(noti)}
            />
          ))}

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
