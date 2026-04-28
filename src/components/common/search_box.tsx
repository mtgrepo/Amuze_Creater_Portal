import { Search } from "lucide-react"
import { Input } from "../ui/input"

export default function SearchBox({
    search,
    setSearch
}: {
    search: string,
    setSearch: (value: string) => void
}) {
    return (
        <div className="relative w-full sm:max-w-sm">
            {/* Search Icon */}
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />

            {/* Input */}
            <Input
                placeholder="Filter name..."
                className="pl-10 pr-10 w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* Clear Button */}
            <button
                type="button"
                onClick={() => setSearch("")}
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-opacity ${search ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
            >
                ✕
            </button>
        </div>
    )
}
