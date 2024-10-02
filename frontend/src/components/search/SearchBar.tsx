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

//import datasets from "@data/datasets.json";
import SearchDatasetItem from "./SearchDatasetItem";
import SearchFacetItem from "./SearchFacetItem";
import { VariableIcon, XMarkIcon } from "@heroicons/react/20/solid";
//import { SearchbarFormType, SearchbarSchema } from "@schema/searchbar.schema";
import { useForm } from "react-hook-form";
import { Badge } from "@components/ui/badge";
import { useRouter } from "next/router";
import { api } from "@utils/api";

export default function SearchBar() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const commandRef = useRef<HTMLDivElement>(null);
  const [showCommandList, setShowCommandList] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showAllFacets, setShowAllFacets] = useState<boolean>(false);
  const [query, setQuery] = useState("");
  const [facetValue, setFacetValue] = useState<{
    display_name: string;
    name: string;
  }>({
    display_name: "",
    name: "",
  });
  const [facetName, setFacetName] = useState("");

  const [storedSearches, setStoredSearches] = useState<Array<any>>();

  const { data } = api.dataset.search.useQuery({
    limit: query?.length > 1 ? 10 : 0,
    query: query,
    ...(facetValue.name ? { [facetName]: [facetValue.name] } : {}),
    facetsFields: `["regions", "sectors", "modes", "services"]`,
  });

  // Retrieve the stored searches or initialize as an empty array

  const facets: any = {
    regions: {
      field: "in",
      description: "a region, country or a city",
      options: data?.facets?.regions?.items,
    },
    sectors: {
      field: "sector",
      description: "road, rail, aviation, water transportation",
      options: data?.facets?.sectors?.items,
    },
    modes: {
      field: "mode",
      description: "car, 2W, 3W, multi-modal etc.",
      options: data?.facets?.modes?.items,
    },
    services: {
      field: "service",
      description: "passenger or freight",
      options: data?.facets?.services?.items,
    },
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isInput = event.target instanceof HTMLInputElement;
      if (
        commandRef.current &&
        !commandRef.current.contains(event.target as Node)
      ) {
        //reset();
        setShowCommandList(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setStoredSearches(
        JSON.parse(localStorage?.getItem("tdcRecentSearches") ?? "[]")
      );
    }
  }, []);

  const handleNarrowSelect = (facet: any) => {
    if (facet) {
      setFacetName(facet);
    }
  };

  const handleTyping = (value: string) => {
    setQuery(value);
    setIsTyping(value.length > 0);

    if (value.length === 0) {
      handleCancelSearch();
    }
  };

  const handleCancelSearch = () => {
    setFacetName("");
    setFacetValue({
      display_name: "",
      name: "",
    });
    setQuery("");
    setIsTyping(false);
  };

  const storeRecentSearch = (search: any) => {
    const _storedSearches: Array<any> = [...(storedSearches ?? [])];
    // Add the new search to the beginning of the array
    _storedSearches.unshift(search);
    // Ensure only the last 5 searches are stored
    if (_storedSearches.length > 5) {
      _storedSearches.pop(); // Remove the oldest search
    }
    // Store the updated array back to localStorage
    localStorage.setItem("tdcRecentSearches", JSON.stringify(_storedSearches));
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const queryObject = {
          ...(facetValue.name ? { [facetName]: [facetValue.name] } : {}),
          query,
        };
        const queryParams = new URLSearchParams(queryObject);

        storeRecentSearch({
          facetName,
          facetValue: facetValue.name,
          query,
        });

        router.push(`/search?${queryParams.toString()}`);
        return false;
      }}
      className=""
    >
      <Command className="relative" shouldFilter={true} ref={commandRef}>
        <div className="relative flex w-full items-center rounded-[12px] border border-[#D1D5DB] bg-popover text-popover-foreground">
          {/* badge with selected filter */}
          {facetValue?.name && (
            <Badge
              variant="muted"
              className="ml-[16px] min-w-fit border border-gray-200 bg-gray-100 px-[6px] py-[2px]"
            >
              {facets[facetName]?.field}: {facetValue?.display_name}
            </Badge>
          )}
          {/* search input*/}
          <CommandInput
            ref={inputRef}
            className="w-full grow rounded-[12px] border-0 py-[18px] pl-4 pr-[150px] focus:border-0 focus:ring-0 "
            onFocus={() => {
              console.log("dsakjas");
              setShowCommandList(true);
            }}
            placeholder="Find statistics, forecasts & studies"
            onInput={(e) => handleTyping((e.target as HTMLInputElement).value)}
            value={query}
          />
          {/* clear search */}
          {(isTyping || facetName || facetValue.name) && (
            <span
              className="absolute right-[120px] z-[20] cursor-pointer p-2 text-gray-500"
              role="button"
              onClick={() => handleCancelSearch()}
            >
              <XMarkIcon width={20} />
            </span>
          )}
          {/* submit search */}
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
          {facets[facetName]?.options?.length && !facetValue.name ? (
            <>
              <CommandGroup
                heading={<CommandListHeader title="Narrow your search" />}
              >
                {facets[facetName]?.options?.map((item: any, i: number) => (
                  <SearchFacetItem
                    key={`${item}-${i}`}
                    badge={`${facets[facetName].field}: ${item.display_name}`}
                    text={""}
                    onSelect={() => {
                      setFacetValue(item);
                      //focus
                    }}
                  />
                ))}
              </CommandGroup>
            </>
          ) : (
            <>
              {!isTyping && !facetValue?.name && (
                <>
                  <SearchNarrow
                    facets={facets}
                    headerAction={() => setShowAllFacets(!showAllFacets)}
                    showAll={showAllFacets}
                    onSelect={(facet: any) => handleNarrowSelect(facet)}
                  />

                  {storedSearches && storedSearches.length > 0 && (
                    <CommandGroup
                      heading={<CommandListHeader title="Recent searches" />}
                    >
                      {storedSearches.map((recent) => {
                        const badge = recent.facetValue
                          ? `${facets[recent.facetName]?.field}: ${
                              facets[recent.facetName]?.options?.find(
                                (o: any) => o.name === recent.facetValue
                              )?.display_name
                            }`
                          : "";
                        return (
                          <SearchFacetItem badge={badge} text={recent.query} />
                        );
                      })}
                      {/* <SearchFacetItem
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
                      <SearchFacetItem text={"passenger vehicles"} />*/}
                    </CommandGroup>
                  )}
                </>
              )}
              {/*(query?.length > 1 || facetValue) && data?.datasets.length && (
                <>
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
              )*/}
            </>
          )}

          {isTyping && data?.datasets && data.datasets.length > 0 && (
            <CommandGroup
              heading={<CommandListHeader title="Datasets" />}
              className="block"
            >
              {data?.datasets?.map((dataset, index) => (
                <SearchDatasetItem {...dataset} />
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </form>
  );
}
