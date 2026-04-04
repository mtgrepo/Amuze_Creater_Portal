import { Link } from "react-router-dom";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import amuze from "../assets/amuze-logo.png";
import { SidebarInset } from "./ui/sidebar";

export default function NotFound() {
  return (
    <SidebarInset>
      {/* 1. Added "relative" to keep the footer contained.
         2. Added "min-h-[calc(100vh-4rem)]" to take up full available height.
         3. Added "items-center" and "justify-center" to center the content.
      */}
      <div className="relative flex flex-1 flex-col items-center justify-center gap-8 px-4 min-h-[calc(100vh-4rem)]">
        
        {/* LOGO SECTION */}
        <div className="relative flex flex-col items-center gap-6">
          <div
            className="absolute w-72 h-72 rounded-full blur-[120px] opacity-40 dark:opacity-20 transition-colors"
            style={{ backgroundColor: "oklch(0.488 0.243 264.376)" }}
          />
          <img
            src={amuze}
            alt="Amuze Logo"
            className="relative z-20 w-full max-w-64 drop-shadow-2xl dark:drop-shadow-[0_0_40px_rgba(255,255,255,0.1)] transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* 404 TEXT */}
        <div className="space-y-4 text-center">
          <div className="flex items-center justify-center gap-3 text-sm font-mono tracking-widest uppercase text-slate-500 dark:text-white/40">
            <HelpCircle size={16} />
            Error 404
          </div>

          <h1 className="text-4xl font-extrabold tracking-tighter text-slate-900 dark:text-white leading-tight">
            Page <span className="text-primary">Not Found</span>!
          </h1>

          <p className="max-w-md mx-auto text-base text-slate-600 dark:text-white/70 leading-relaxed">
            Oops! It seems the page you are looking for has taken a dive. It
            might have been moved, deleted, or never existed in this realm.
          </p>
                    <Button
            asChild
          >
            <Link to="/">
              Back to Dashboard
            </Link>
          </Button>
        </div>

        {/* FOOTER - Anchored correctly due to relative parent */}
        <footer className="absolute bottom-6 left-0 w-full z-10 text-center text-[10px] font-mono tracking-widest uppercase text-slate-400 dark:text-white/30 px-4">
          Amuze Creator Portal — All Rights Reserved ©{" "}
          {new Date().getFullYear()}
        </footer>
      </div>
    </SidebarInset>
  );
}