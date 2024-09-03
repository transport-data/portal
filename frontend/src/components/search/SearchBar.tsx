import { Button } from "@components/ui/button";
import { SearchIcon } from "lucide-react";
import { useSearchContext } from "@components/search/SearchProvider";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useEffect, useRef, useState } from "react";
import CommandListHeader from "./SearchDropdownHeader";
import SearchNarrow from "./SearchNarrow";

import { datasets } from "@static-db/datasets";
import SearchDatasetItem from "./SearchDatasetItem";
import SearchNarrowItem from "./SearchNarrowItem";
import { VariableIcon } from "@heroicons/react/20/solid";

export default function SearchBar() {
  const commandRef = useRef<HTMLDivElement>(null);
  const [showCommandList, setShowCommandList] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showAllFacets, setShowAllFacets] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>("");

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

  const handleNarrowSelect = (name: string) => {
    //setSearchInput(`${name}: `);
  };

  const handleTyping = (value: string) => {
    setSearchInput(value);
    setIsTyping(value.length > 0);
  };
  return (
    <>
      <Command className="relative" shouldFilter={true}>
        <div className="relative">
          <CommandInput
            className="w-full rounded-[12px] border border-[#D1D5DB] py-[18px] pl-4 pr-[20px] focus:border-[#D1D5DB] focus:ring-[#D1D5DB]"
            onFocus={() => setShowCommandList(true)}
            placeholder="Find statistics, forecasts & studies"
            onInput={(e) => handleTyping((e.target as HTMLInputElement).value)}
            value={searchInput}
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
          className={`absolute top-0 z-[15] mt-[70px] max-h-[500px] w-full bg-white shadow-[0px_4px_6px_0px_#0000000D] ${
            showCommandList ? "block" : "hidden"
          }`}
          ref={commandRef}
        >
          {!isTyping && (
            <>
              <SearchNarrow
                headerAction={() => setShowAllFacets(!showAllFacets)}
                showAll={showAllFacets}
                onSelect={(name: string) => handleNarrowSelect(name)}
              />
              {!showAllFacets && (
                <CommandGroup
                  heading={<CommandListHeader title="Recent searches" />}
                >
                  <SearchNarrowItem
                    text={"passanger activity"}
                    icon={<VariableIcon width={20} className="text-gray-500" />}
                    context={"Indicator"}
                  />
                  <SearchNarrowItem
                    badge={"in: Asia"}
                    text={"passenger transport activity"}
                  />
                  <SearchNarrowItem text={"heavy duty vehicles"} />
                  <SearchNarrowItem text={"passenger vehicles"} />
                </CommandGroup>
              )}
            </>
          )}
          {isTyping && (
            <>
              <CommandGroup heading={<CommandListHeader title="Datasets" />}>
                {datasets.slice(0, 2).map((dataset, index) => (
                  <SearchDatasetItem {...dataset} key={index} />
                ))}
              </CommandGroup>

              <CommandGroup heading={<CommandListHeader title="Indicators" />}>
                <SearchNarrowItem
                  text={"passanger activity"}
                  icon={<VariableIcon width={20} className="text-gray-500" />}
                  context={"Indicator"}
                />
                <SearchNarrowItem
                  text={"vehicle fleet"}
                  icon={<VariableIcon width={20} className="text-gray-500" />}
                  context={"Indicator"}
                />
              </CommandGroup>

              <CommandGroup heading={<CommandListHeader title="Others" />}>
                <SearchNarrowItem text={"vehicle fleet France"} />
                <SearchNarrowItem text={"vehicle registration Thailand"} />
                <SearchNarrowItem text={"heavy duty vehicles"} />
                <SearchNarrowItem text={"passenger vehicles"} />
              </CommandGroup>
            </>
          )}
        </CommandList>
      </Command>
    </>
  );
}
