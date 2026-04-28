import { useInfiniteQuery } from "@tanstack/react-query"
import { getAuthorNotifications } from "@/http/apis/notification/notificationApi"

export const useInfiniteNotificationsQuery = (limit: number = 10) => {
  return useInfiniteQuery({
    queryKey: ["notifications"],
    initialPageParam: 1,

    queryFn: async ({ pageParam }) => {
      const res = await getAuthorNotifications({
        page: pageParam as number,
        limit,
      })

      return res.data
    },

     getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.flatMap(p => p.notifications).length
      const total = lastPage.total

      if (loaded >= total) return undefined

      return (lastPage.page ?? allPages.length) + 1
    },
  })
}