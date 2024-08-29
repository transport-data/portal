import { Button } from "@components/ui/button";
import { SearchIcon } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="relative mt-8 lg:max-w-[576px]">
      <input
        type="email"
        placeholder="Find statistics, forecasts & studies"
        className="w-full rounded-[12px] border border-[#D1D5DB] py-[18px] pl-4 pr-[20px] focus:border-[#D1D5DB] focus:ring-[#D1D5DB]"
      />
      <Button
        type="submit"
        className="absolute right-[10px] top-[10px] flex gap-[8px]"
      >
        <SearchIcon width={15} />
        Search
      </Button>
    </div>
  );
}
