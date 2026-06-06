import { Spotlight } from "../ui/spotlight-new";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function WelcomeBanner({
  creator,
}: {
  creator: {
    name: string;
    email: string;
    profile?: string;
  };
}) {
  const navigate = useNavigate();
  return (
    <div className="w-full mx-auto">
      {/* FIXED: for mobile spacing */}
      <div className="min-h-60 md:h-60 w-full rounded-2xl relative overflow-hidden border border-border bg-linear-to-t py-6 md:py-0">
        {/* Spotlight background */}
        <Spotlight />

        {/* CONTENT */}
        <div className="relative h-full flex flex-col md:flex-row items-center justify-between px-6 gap-6 md:gap-0">
          {/* LEFT: TEXT */}
          <div className="text-center md:text-left space-y-2">
            <p className="text-xl md:text-2xl lg:text-3xl font-semibold">
              {getGreeting()},{" "}
              <span className="text-primary">{creator?.name || "Creator"}</span>
            </p>
            <h2 className="text-sm font-medium">Current Ranking: 5</h2>

            <h2 className="text-sm opacity-80 italic">Ready to work?</h2>

            {/* <p className="text-sm opacity-80">
              View your stats and manage your content.
            </p> */}
          </div>

          {/* RIGHT: LOGO / PROFILE */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-0">
            <div className="flex items-center justify-center">
              <Avatar className="h-20 w-20 md:h-25 md:w-25 rounded-lg shrink-0">
                <AvatarImage src={creator?.profile} alt={creator?.name} />
                <AvatarFallback className="rounded-lg bg-primary-foreground text-primary">
                  {creator?.email?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight px-3 space-y-2">
                <p className="truncate font-medium max-w-[150px] sm:max-w-[200px]">
                  {creator?.name}
                </p>
                <p>Ranking: {5}</p>
                <Button
                  variant="link"
                  className="cursor-pointer p-0 h-auto justify-start text-xs md:text-sm"
                  onClick={() => navigate("account/user-details")}
                >
                  View Your Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}