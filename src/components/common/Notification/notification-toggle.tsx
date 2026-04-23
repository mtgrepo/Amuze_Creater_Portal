import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell } from "lucide-react"
import CreatorNotiDropdown from "./notification-dropdown"
import { useCreatorNoti } from "./notificationContext"

const CreatorNotificationToggle = () => {
  const { unreadCount, toggleDropdown } = useCreatorNoti()

  return (
    <div className="relative">
      <Button
        className="relative relative flex items-center justify-center"
        aria-label="Notifications"
        onClick={toggleDropdown}
        variant="outline" size="icon"
      >
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-2 -right-2 rounded-full min-w-[20px] text-center"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
        <Bell size={30} />
      </Button>

      <CreatorNotiDropdown />
    </div>
  )
}

export default CreatorNotificationToggle