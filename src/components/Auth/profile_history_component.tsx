import { Calendar, ImageIcon } from "lucide-react";
import type { ProfileHistory } from "@/types/response/auth/loginCreatorResponse";

interface ProfileHistoryProps {
  history?: ProfileHistory[];
}

export default function ProfileHistoryComponent({ history }: ProfileHistoryProps) {
    console.log("profile data", history)
    // const profile = history?.photos;
  if (!history || history?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-card rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-800 mt-5">
        <ImageIcon className="w-12 h-12 text-slate-300 mb-3" />
        <p className="text-slate-500 font-medium">No profile photo history found.</p>
      </div>
    );
  }

  return (
    <div className="mt-5">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-bold">Profile Photos</h3>
        <span className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs px-2 py-1 rounded-full">
          {history.length}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {history.map((item) => (
          <div 
            key={item?.id} 
            className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-card shadow-sm transition-all hover:shadow-md"
          >
            {/* The Photo */}
            <img
              src={item?.profile}
              alt={`Profile version ${item.id}`}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />

            {/* Hover Overlay*/}
            <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-3">
              <div className="flex items-center gap-2 text-white text-[10px] sm:text-xs font-medium">
                <Calendar className="w-3 h-3" />
                <span>
                  {item?.created_at 
                    ? new Date(item.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      }) 
                    : "Unknown date"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}