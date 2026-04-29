import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";
import logo from "@/assets/amuze-logo.png";
import { Spotlight } from "../ui/spotlight-new";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function WelcomeBanner() {
  const creator = useSelector((state: RootState) => state.auth.creator);

  return (
    <div className="w-full mx-auto">
      <div className="h-60 w-full rounded-2xl relative overflow-hidden border border-border bg-linear-to-t ">

        {/* Spotlight background */}
        <Spotlight />

        {/* CONTENT (on top) */}
        <div className="relative z-10 h-full flex flex-col md:flex-row items-center justify-between px-6">

          {/* LEFT: TEXT */}
          <div className=" text-center md:text-left space-y-3">
            <p className="text-2xl md:text-3xl font-semibold">
              {getGreeting()},{" "}
              <span className="text-primary">
                {creator?.name || "Creator"}
              </span>
            </p>

            <h2 className="text-sm">
              Ready to work?
            </h2>

            <p className="text-sm  mt-1">
              View your stats and manage your content.
            </p>
          </div>

          {/* RIGHT: LOGO */}
          <div className="mt-4 md:mt-0 flex items-center justify-center">
            <img
              src={logo}
              alt="Logo"
              className="h-28 md:h-36 object-contain opacity-90"
            />
          </div>
        </div>
      </div>
    </div>
  );
}