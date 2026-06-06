import { Search, X } from "lucide-react";
import { Input } from "../ui/input";

export default function SearchBox({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (value: string) => void;
}) {
  return (
    <div className="relative w-full">
      {/* Floating Label matching the calendar items */}
      <label className="absolute -top-2 left-3 px-1 bg-card text-xs font-medium text-muted-foreground z-10 uppercase tracking-wider">
        Name
      </label>

      {/* Input container styled precisely like your date buttons */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        
        <Input
          placeholder="Filter name..."
          className="pl-10 pr-10 w-full border-2 rounded-lg bg-background font-normal focus-visible:ring-0 focus-visible:border-primary transition-colors"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Clear Button */}
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-sm focus:outline-none"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}