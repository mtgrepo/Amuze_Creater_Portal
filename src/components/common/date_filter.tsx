import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { format, isValid, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { CalendarIcon, X } from "lucide-react"; // Imported X icon
import { useTranslation } from "react-i18next";

type DateFilterProps = {
  label: string;
  placeholder?: string;
  value: string; 
  onChange: (dateStr: string) => void;
  disabledMatcher?: any;
};

export default function DateFilter({
  label,
  placeholder = "Select date",
  value,
  onChange,
  disabledMatcher,
}: DateFilterProps) {
  
  // Helper to safely parse string back to Date instance for shadcn Calendar
  const getSafeDate = (dateStr: string): Date | undefined => {
    if (!dateStr) return undefined;
    const parsed = parseISO(dateStr);
    return isValid(parsed) ? parsed : undefined;
  };

  const selectedDate = getSafeDate(value);
  const { t } = useTranslation();

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents the popover from opening when clicking clear
    onChange("");
  };

  return (
    <div className="relative w-full">
      {/* Floating Label */}
      <label className="absolute -top-2 left-3 px-1 bg-card text-xs font-medium text-muted-foreground z-10">
        {t(label)}
      </label>
      
      <Popover>
        {/* Wrapper to allow absolute placement inside the trigger space */}
        <div className="relative w-full flex items-center">
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start border-2 rounded-lg h-9 text-left font-normal",
                !value && "text-muted-foreground",
                selectedDate && "pr-9" // Extra right padding to avoid text overlapping with 'X'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
              <span className="truncate">
                {selectedDate ? format(selectedDate, "PPP") : placeholder}
              </span>
            </Button>
          </PopoverTrigger>

          {/* Clear Button - Inside the field on the right edge */}
          {selectedDate && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2.5 z-20 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Clear date"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(d) => onChange(d ? format(d, "yyyy-MM-dd") : "")}
            disabled={disabledMatcher}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}