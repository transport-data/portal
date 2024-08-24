import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "../../lib/utils";

export function DatePicker({ date, setDate }: { date?: string; setDate: any }) {
  const dateObj = date ? new Date(date) : undefined;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="input"
          className={cn(
            "justify-start text-left font-normal w-full px-4 text-xs",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          captionLayout="dropdown-buttons"
          selected={dateObj}
          onSelect={(date) => {
            const newDate = new Date();
            setDate(date ? date.toISOString() : newDate.toISOString());
          }}
          fromYear={1960}
          toYear={2030}
        />
      </PopoverContent>
    </Popover>
  );
}
