import { Button } from "@components/ui/button";
import { SearchIcon } from "lucide-react";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useEffect, useRef, useState } from "react";

const CommandListHeader = ({ title }: { title: string }) => {
  return (
    <div className="flex w-full shrink-0 items-center gap-2">
      <span className="w-fit text-sm font-semibold text-gray-900">{title}</span>
      <span className="ml-auto mr-auto h-[1px] grow bg-gray-200"></span>
      <span className="pointer w-fit">Show all</span>
    </div>
  );
};

export default function SearchBar() {
  const commandRef = useRef<HTMLDivElement>(null);
  const [showCommandList, setShowCommandList] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isInput = event.target instanceof HTMLInputElement;
      if (
        !isInput && //prevent input click
        commandRef.current &&
        !commandRef.current.contains(event.target as Node)
      ) {
        setShowCommandList(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <Command className="relative">
        <div className="relative">
          <CommandInput
            className="rounded-[12px] border border-[#D1D5DB] py-[20px] pl-4 pr-[20px] focus:border-[#D1D5DB] focus:ring-[#D1D5DB]"
            onFocus={() => setShowCommandList(true)}
            onKeyUp={() => setShowCommandList(true)}
            placeholder="Find statistics, forecasts & studies"
          />
          <Button
            type="submit"
            className="absolute right-[10px] top-[10px] flex gap-[8px]"
          >
            <SearchIcon width={15} />
            Search
          </Button>
        </div>
        <CommandList
          className={`absolute top-0 z-10 mt-[70px] w-full bg-white shadow-[0px_4px_6px_0px_#0000000D] ${
            showCommandList ? "block" : "hidden"
          }`}
          ref={commandRef}
        >
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup
            heading={<CommandListHeader title="Narrow your search" />}
          >
            <CommandItem>Calendar</CommandItem>
            <CommandItem>Search Emoji</CommandItem>
            <CommandItem>Calculator</CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>Profile</CommandItem>
            <CommandItem>Billing</CommandItem>
            <CommandItem>Settings</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </>
  );
  /* return (
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
  );*/
}
