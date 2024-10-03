import { Button } from "@components/ui/button";
import { SearchIcon } from "lucide-react";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { useEffect, useRef, useState } from "react";
import CommandListHeader from "./SearchDropdownHeader";
import SearchNarrow from "./SearchFacets";
import SearchDatasetItem from "./SearchDatasetItem";
import SearchFacetItem from "./SearchFacetItem";
import { VariableIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { Badge } from "@components/ui/badge";
import { useRouter } from "next/router";
import { api } from "@utils/api";

interface FacetValueProps {
  display_name: string;
  name: string;
}

interface RecentSearchProps {
  facetName?: string;
  facetValue?: string;
  query?: string;
  indicator?: any;
}

export default function SearchBar() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const commandRef = useRef<HTMLDivElement>(null);
  const [showCommandList, setShowCommandList] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showAllFacets, setShowAllFacets] = useState<boolean>(false);
  const [query, setQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [facetValue, setFacetValue] = useState<FacetValueProps>({
    display_name: "",
    name: "",
  });
  const [facetName, setFacetName] = useState("");

  const [storedSearches, setStoredSearches] =
    useState<Array<RecentSearchProps>>();

  const { data, isLoading } = api.dataset.search.useQuery({
    limit: query?.length > 1 ? 10 : 0,
    query: query,
    ...(facetValue.name
      ? {
          [facetName]:
            facetName === "startYear" || facetName === "endYear"
              ? facetValue.name
              : [facetValue.name],
        }
      : {}),
    facetsFields: `["regions", "sectors", "modes", "services", "indicator", "temporal_coverage_start", "temporal_coverage_end"]`,
  });

  const facets: any = {
    regions: {
      field: "in",
      description: "a region, country or a city",
      options: data?.facets?.regions?.items,
      isMultiple: true,
    },
    startYear: {
      field: "after",
      description: "referencing data after an year",
      options: (data?.facets?.temporal_coverage_start?.items as any[])
        ?.map((d: any) => ({
          ...d,
          display_name: new Date(d.name)?.getFullYear(),
          name: new Date(d.name)?.getFullYear(),
        }))
        .filter(
          (obj, index, self) =>
            index === self.findIndex((o) => o.name === obj.name)
        ),
    },
    endYear: {
      field: "before",
      description: "referencing data before an year",
      options: (data?.facets?.temporal_coverage_end?.items as any[])
        ?.map((d: any) => ({
          ...d,
          display_name: new Date(d.name)?.getFullYear(),
          name: new Date(d.name)?.getFullYear(),
        }))
        .filter(
          (obj, index, self) =>
            index === self.findIndex((o) => o.name === obj.name)
        ),
    },

    sectors: {
      field: "sector",
      description: "road, rail, aviation, water transportation",
      options: data?.facets?.sectors?.items,
      isMultiple: true,
    },
    modes: {
      field: "mode",
      description: "car, 2W, 3W, multi-modal etc.",
      options: data?.facets?.modes?.items,
      isMultiple: true,
    },
    services: {
      field: "service",
      description: "passenger or freight",
      options: data?.facets?.services?.items,
      isMultiple: true,
    },
  };

  /* handle click outside the search container to close command list */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
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
  //get stored searches
  useEffect(() => {
    if (typeof window !== "undefined")
      setStoredSearches(
        JSON.parse(localStorage?.getItem("tdcRecentSearches") ?? "[]")
      );
  }, []);

  useEffect(() => {
    const setQueryValue = setTimeout(() => {
      setQuery(inputValue);
    }, 400);

    return () => clearTimeout(setQueryValue);
  }, [inputValue]);

  const handleFacetNameChange = (facetName: string) => {
    if (facetName) setFacetName(facetName);
  };

  const handleFacetValueChange = (item: FacetValueProps) => {
    setFacetValue(item);
    inputRef?.current?.focus();
  };

  const handleTyping = (value: string) => {
    setInputValue(value);
    setIsTyping(value.length > 0);
  };

  const handleCancelSearch = () => {
    setFacetName("");
    setFacetValue({
      display_name: "",
      name: "",
    });
    setInputValue("");
    setQuery("");
    setIsTyping(false);
  };

  const handleSubmit = () => {
    const value = facets[facetName]?.isMultiple
      ? [facetValue.name]
      : facetValue.name;

    console.log(value);
    const queryObject = {
      ...(facetValue.name ? { [facetName]: value } : {}),
      query,
    };
    const queryParams = new URLSearchParams(queryObject);

    storeRecentSearch({
      facetName,
      facetValue: facetValue.name,
      query,
    });

    router.push(`/search?${queryParams.toString()}`);
  };

  const storeRecentSearch = (search: RecentSearchProps) => {
    const _storedSearches: Array<RecentSearchProps> = [
      ...(storedSearches ?? []),
    ];
    // Add the new search to the beginning of the array
    _storedSearches.unshift(search);
    // Ensure only the last 5 searches are stored
    if (_storedSearches.length > 5) {
      _storedSearches.pop(); // Remove the oldest search
    }
    // Store the updated array back to localStorage
    localStorage.setItem("tdcRecentSearches", JSON.stringify(_storedSearches));
  };

  const filteredIndicators = (
    data?.facets?.indicator?.items as {
      name: string;
      display_name: string;
      count: number;
    }[]
  )?.filter(
    (indicator) =>
      isTyping &&
      indicator.display_name
        ?.toLocaleLowerCase()
        .includes(query?.toLocaleLowerCase())
  );

  return (
    <form onSubmit={(event) => handleSubmit()} className="">
      <Command className="relative" shouldFilter={false} ref={commandRef}>
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
            onFocus={() => setShowCommandList(true)}
            placeholder="Find statistics, forecasts & studies"
            onInput={(e) => handleTyping((e.target as HTMLInputElement).value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleSubmit();
            }}
            value={inputValue}
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
          {/* Have Selected a Facet:  user have selected any of search narrow options, show selected facet options  */}
          {facetName &&
          facets[facetName]?.options?.length &&
          !facetValue.name ? (
            <CommandGroup
              heading={<CommandListHeader title="Narrow your search" />}
            >
              {facets[facetName]?.options?.map((item: any, i: number) => (
                <SearchFacetItem
                  key={`${item}-${i}`}
                  badge={`${facets[facetName].field}: ${item.display_name}`}
                  text={""}
                  onSelect={() => handleFacetValueChange(item)}
                />
              ))}
            </CommandGroup>
          ) : (
            /* Is Searching without Selecting a Facet */
            <>
              {
                /*Found Datasets: if have any datasets available then show datasets results*/
                (data?.datasets && data.datasets.length > 0) ||
                filteredIndicators?.length > 0 ? (
                  <>
                    {data?.datasets && data.datasets.length > 0 && (
                      <CommandGroup
                        heading={<CommandListHeader title="Datasets" />}
                        className="block"
                      >
                        {data?.datasets?.map((dataset, index) => (
                          <SearchDatasetItem {...dataset} />
                        ))}
                      </CommandGroup>
                    )}

                    {filteredIndicators?.length > 0 && (
                      <CommandGroup
                        heading={<CommandListHeader title="Indicators" />}
                      >
                        {filteredIndicators.map((indicator, x) => (
                          <SearchFacetItem
                            key={`indicator-${x}`}
                            text={indicator.display_name}
                            onSelect={() => {
                              storeRecentSearch({
                                indicator: indicator,
                              });
                            }}
                            href={`/search?indicator=${indicator.name}`}
                            icon={
                              <VariableIcon
                                width={20}
                                className="text-gray-500"
                              />
                            }
                            context={"Indicator"}
                          />
                        ))}
                      </CommandGroup>
                    )}
                  </>
                ) : (
                  /* No Datasets Found, No Facet Selected and user is not typing: show facet options and recent searches*/
                  <>
                    {!isTyping && !facetValue?.name && (
                      <>
                        <SearchNarrow
                          facets={facets}
                          headerAction={() => setShowAllFacets(!showAllFacets)}
                          showAll={showAllFacets}
                          onSelect={(facet: any) =>
                            handleFacetNameChange(facet)
                          }
                        />

                        {storedSearches && storedSearches.length > 0 && (
                          <CommandGroup
                            heading={
                              <CommandListHeader title="Recent searches" />
                            }
                          >
                            {storedSearches.map((recent) => {
                              const badge =
                                recent.facetValue && recent.facetName
                                  ? `${facets[recent.facetName]?.field}: ${
                                      facets[recent.facetName]?.options?.find(
                                        (o: any) => o.name === recent.facetValue
                                      )?.display_name
                                    }`
                                  : "";

                              const icon = recent.indicator ? (
                                <VariableIcon
                                  width={20}
                                  className="text-gray-500"
                                />
                              ) : null;

                              const context = recent.indicator
                                ? "Indicator"
                                : "";
                              console.log(recent);

                              return (
                                <SearchFacetItem
                                  badge={badge}
                                  text={
                                    recent.indicator?.display_name ||
                                    recent.query
                                  }
                                  icon={icon}
                                  context={context}
                                />
                              );
                            })}
                          </CommandGroup>
                        )}
                      </>
                    )}
                  </>
                )
              }

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

           
                </>
              )*/}
            </>
          )}
        </CommandList>
      </Command>
    </form>
  );
}
