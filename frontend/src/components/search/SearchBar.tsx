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
} from "@/components/ui/command";
import { useEffect, useRef, useState } from "react";
import CommandListHeader from "./SearchDropdownHeader";
import SearchNarrow from "./SearchFacets";

import datasets from "@data/datasets.json";
import SearchDatasetItem from "./SearchDatasetItem";
import SearchFacetItem from "./SearchFacetItem";
import { VariableIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { SearchbarFormType, SearchbarSchema } from "@schema/searchbar.schema";
import { useForm } from "react-hook-form";
import { Badge } from "@components/ui/badge";
import { useRouter } from "next/router";

const facets: any = {
  in: {
    field: "region",
    description: "a region, country or a city",
    suggestions: [
      "Africa",
      "Asia",
      "Australia and Oceania",
      "Europe",
      "North America",
      "South America",
      "United States",
    ],
  },
  /*after: {
    description: "referencing data after a date",
  },
  before: {
    description: "referencing data before a date",
  },*/
  sector: {
    description: "road, rail, aviation, water transportation",
    suggestions: ["road", "rail", "aviation", "water transportation"],
  },
  mode: {
    description: "car, 2W, 3W, multi-modal etc.",
    suggestions: ["car", "2W", "3W", "multi-modal"],
  },
  service: {
    description: "passenger or freight",
    suggestions: ["passenger", "freight"],
  },
  fuel: {
    description: "battery electric, petrol, diesel etc.",
    suggestions: ["battery electric", "petrol", "diesel"],
  },
};

export default function SearchBar() {
  const commandRef = useRef<HTMLDivElement>(null);
  const [showCommandList, setShowCommandList] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showAllFacets, setShowAllFacets] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<SearchbarFormType>();
  const {
    handleSubmit,
    setValue,
    register,
    watch,
    reset,
    getValues,
    setFocus,
  } = form;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isInput = event.target instanceof HTMLInputElement;
      if (
        commandRef.current &&
        !commandRef.current.contains(event.target as Node)
      ) {
        reset();
        setShowCommandList(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNarrowSelect = (facet: any) => {
    if (facet) {
      setValue("facetName", facet);
      setFocus("query");
    }
  };

  const handleTyping = (value: string) => {
    console.log(value);
    setValue("query", value);
    setIsTyping(value.length > 0);
  };

  const handleCancelSearch = () => {
    reset();
    setTimeout(() => {
      setFocus("query");
    }, 150);
  };

  const facetValue = watch("facetValue");
  const facetName = watch("facetName");
  const query = watch("query");

  return (
    <form
      onSubmit={(event) =>
        void handleSubmit(async (data) => {
          const { facetName, facetValue, query } = getValues();
          const queryParams = new URLSearchParams({
            [facetName]: facetValue,
            query,
          }).toString();

          router.push(`/datasets?${queryParams}`);
          return false;
        })(event)
      }
      className=""
    >
      <Command className="relative" shouldFilter={true} ref={commandRef}>
        <div className="relative flex w-full items-center rounded-[12px] border border-[#D1D5DB] bg-popover text-popover-foreground">
          {facetValue && (
            <Badge
              variant="muted"
              className="ml-[16px] min-w-fit border border-gray-200 bg-gray-100 px-[6px] py-[2px]"
            >
              {facetName}: {facetValue}
            </Badge>
          )}
          <CommandInput
            className="w-full grow rounded-[12px] border-0 py-[18px] pl-4 pr-[20px] focus:border-0 focus:ring-0 "
            onFocus={() => setShowCommandList(true)}
            placeholder="Find statistics, forecasts & studies"
            onInput={(e) => handleTyping((e.target as HTMLInputElement).value)}
            value={query}
            {...register("query")}
          />
          {(isTyping || facetName || facetValue) && (
            <span
              className="absolute right-[120px] z-[20] cursor-pointer p-2 text-gray-500"
              role="button"
              onClick={() => handleCancelSearch()}
            >
              <XMarkIcon width={20} />
            </span>
          )}
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
        >
          {facets[facetName]?.suggestions?.length && !facetValue ? (
            <CommandGroup
              heading={<CommandListHeader title="Narrow your search" />}
            >
              {facets[facetName]?.suggestions?.map(
                (item: string, i: number) => (
                  <SearchFacetItem
                    key={`${item}-${i}`}
                    badge={`${facetName}: ${item}`}
                    text={""}
                    onSelect={() => {
                      setValue("facetValue", item);
                      setFocus("query");
                    }}
                  />
                )
              )}
            </CommandGroup>
          ) : (
            <>
              {!isTyping && (
                <>
                  {!facetValue && (
                    <SearchNarrow
                      facets={facets}
                      headerAction={() => setShowAllFacets(!showAllFacets)}
                      showAll={showAllFacets}
                      onSelect={(facet: any) => handleNarrowSelect(facet)}
                    />
                  )}
                  {!facetValue && (
                    <CommandGroup
                      heading={<CommandListHeader title="Recent searches" />}
                    >
                      <SearchFacetItem
                        text={"passanger activity"}
                        icon={
                          <VariableIcon width={20} className="text-gray-500" />
                        }
                        context={"Indicator"}
                      />
                      <SearchFacetItem
                        badge={"in: Asia"}
                        text={"passenger transport activity"}
                      />
                      <SearchFacetItem text={"heavy duty vehicles"} />
                      <SearchFacetItem text={"passenger vehicles"} />
                    </CommandGroup>
                  )}
                </>
              )}
              {(isTyping || facetValue) && (
                <>
                  <CommandGroup
                    heading={<CommandListHeader title="Datasets" />}
                  >
                    {datasets.slice(0, 2).map((dataset, index) => (
                      <SearchDatasetItem {...dataset} key={index} />
                    ))}
                  </CommandGroup>

                  <CommandGroup
                    heading={<CommandListHeader title="Indicators" />}
                  >
                    <SearchFacetItem
                      text={"passanger activity"}
                      icon={
                        <VariableIcon width={20} className="text-gray-500" />
                      }
                      context={"Indicator"}
                    />
                    <SearchFacetItem
                      text={"vehicle fleet"}
                      icon={
                        <VariableIcon width={20} className="text-gray-500" />
                      }
                      context={"Indicator"}
                    />
                  </CommandGroup>

                  {!facetValue && (
                    <CommandGroup
                      heading={<CommandListHeader title="Others" />}
                    >
                      <SearchFacetItem text={"vehicle fleet France"} />
                      <SearchFacetItem text={"vehicle registration Thailand"} />
                      <SearchFacetItem text={"heavy duty vehicles"} />
                      <SearchFacetItem text={"passenger vehicles"} />
                    </CommandGroup>
                  )}
                </>
              )}
            </>
          )}
        </CommandList>
      </Command>
    </form>
  );
}
