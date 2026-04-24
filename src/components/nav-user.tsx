import { BadgeCheck, Bell, ChevronsUpDown, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useDispatch } from "react-redux";
import { logoutAction } from "../redux/auth/authSlice";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";

export function NavUser({
  creator,
}: {
  creator: {
    name: string;
    email: string;
    avatar?: string;
  };
}) {
  const { isMobile } = useSidebar();

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutAction());
    toast.success("Logged out successfully");
  };

  const location = useLocation();
  const isActive = location.pathname.startsWith("/account");
  const navigate = useNavigate();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={`${isActive ? "bg-primary hover:bg-primary/90 text-primary-foreground" : ""}
                          data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground
                        `}
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={creator?.avatar} alt={creator?.name} />
                <AvatarFallback className="rounded-lg bg-primary-foreground text-primary">
                  {creator?.email?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{creator?.name}</span>
                <span className="truncate text-xs">{creator?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={creator?.avatar} alt={creator?.name} />
                  <AvatarFallback className="rounded-lg bg-primary-foreground text-primary">
                    {creator?.email?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{creator?.name}</span>
                  <span className="truncate text-xs">{creator?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => navigate("/account/user-details")}
                className={`
                  ${isActive ? "bg-primary hover:bg-primary/90 text-primary-foreground" : ""}
                  data-[state=open]:bg-sidebar-accent 
                  data-[state=open]:text-sidebar-accent-foreground
                  cursor-pointer
                `}
              >
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
