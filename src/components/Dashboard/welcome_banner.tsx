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
      <div className="min-h-[180px] md:h-48 w-full rounded-2xl relative overflow-hidden border border-border bg-gradient-to-t from-background to-muted/30 py-6 md:py-0">
        {/* Spotlight background animation component */}
        <Spotlight />

        {/* CONTENT ROW */}
        <div className="relative h-full flex flex-col md:flex-row items-center justify-between px-6 md:px-8 gap-6 md:gap-0">
          
          {/* LEFT: TEXT SUMMARY */}
          <div className="text-center md:text-left space-y-1.5">
            <p className="text-2xl md:text-3xl font-bold tracking-tight">
              {getGreeting()},{" "}
              <span className="text-primary">{creator?.name || "Creator"}</span>
            </p>
            <div className="flex flex-row sm:flex-row sm:items-center justify-center md:justify-start gap-2 sm:gap-4 text-sm text-muted-foreground">
              <p className="font-medium">
                Current Ranking: <span className="text-foreground font-semibold">#5</span>
              </p>
              <span className="hidden sm:inline text-muted-foreground/40">•</span>
              <p className="italic opacity-90">Ready to break some records today?</p>
            </div>
          </div>

          {/* RIGHT: CLEAN AVATAR ACTION ELEMENT */}
          <div className="flex items-center gap-4 bg-background/40 backdrop-blur-xs border border-border/60 p-3 pr-5 rounded-xl shadow-xs">
            <Avatar className="h-16 w-16 rounded-lg shrink-0">
              <AvatarImage src={creator?.profile} alt={creator?.name} />
              <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-bold">
                {creator?.email?.slice(0, 2).toUpperCase() || "AM"}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex flex-col text-left">
              <p className="font-semibold text-sm truncate max-w-[140px]">
                {creator?.name || "Account Profile"}
              </p>
              <Button
                variant="link"
                className="cursor-pointer p-0 h-auto justify-start text-xs text-primary hover:text-primary/80 transition-colors"
                onClick={() => navigate("account/user-details")}
              >
                View Your Profile
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}