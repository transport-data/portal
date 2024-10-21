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
import Link from "next/link";

interface FacetValueProps {
  display_name: string;
  name: string;
}

interface RecentSearchProps {
  facetName?: string;
  facetValue?: string;
  text?: string;
  indicator?: any;
  query: any;
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
  const [facetName, setFacetName] = useState("");
  const [storedSearches, setStoredSearches] =
    useState<Array<RecentSearchProps>>();
  const [facetValue, setFacetValue] = useState<FacetValueProps>({
    display_name: "",
    name: "",
  });

  const { data, isLoading } = api.dataset.search.useQuery({
    limit: query?.length > 1 ? 5 : 0,
    query: query,
    sort: "score desc, metadata_modified desc",
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
      name: "in",
      queryParam: "region",
      description: "a region, country or a city",
      options: data?.facets?.regions?.items,
      isMultiple: true,
    },
    startYear: {
      name: "after",
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
      name: "before",
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
      name: "sector",
      description: "road, rail, aviation, water transportation",
      options: data?.facets?.sectors?.items,
      isMultiple: true,
    },
    modes: {
      name: "mode",
      description: "car, 2W, 3W, multi-modal etc.",
      options: data?.facets?.modes?.items,
      isMultiple: true,
    },
    services: {
      name: "service",
      description: "passenger or freight",
      options: data?.facets?.services?.items,
      isMultiple: true,
    },
  };

  useEffect(() => {
    //get stored tdc-recent-searches stored locally
    setStoredSearches(
      JSON.parse(localStorage?.getItem("tdcRecentSearches") ?? "[]")
    );
    /* handle click outside the search container to close command list */
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
    const paramName =
      facets[facetName]?.queryParam || facets[facetName]?.name || facetName;
    const value = facets[facetName]?.isMultiple
      ? [facetValue.name]
      : facetValue.name;

    const queryObject = {
      ...(facetValue.name ? { [paramName]: value } : {}),
      query: inputValue,
    };
    if (inputValue)
      storeRecentSearch({
        text: inputValue,
        facetName: facets[facetName]?.name,
        facetValue: facetValue.display_name,
        query: queryObject,
      });

    setShowCommandList(false);

    router.push({
      pathname: "/search",
      query: queryObject,
    });

    return false;
  };

  const storeRecentSearch = (search: RecentSearchProps) => {
    const _storedSearches: Array<RecentSearchProps> = [
      ...(storedSearches ?? []),
    ].filter((item) => JSON.stringify(item) !== JSON.stringify(search));
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
  )
    ?.filter(
      (indicator) =>
        isTyping &&
        indicator.display_name
          ?.toLocaleLowerCase()
          .includes(query?.toLocaleLowerCase())
    )
    .sort((a: any, b: any) => a.name - b.name);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
        return false;
      }}
      className=""
    >
      <Command
        className="search-bar relative"
        shouldFilter={false}
        ref={commandRef}
      >
        <div className="relative flex w-full items-center rounded-[12px] border border-[#D1D5DB] bg-popover pl-4 text-popover-foreground">
          {!facetValue?.name && facetName ? (
            <span className="mr-[10px]">{facets[facetName]?.name}:</span>
          ) : (
            ""
          )}
          {/* badge with selected filter */}
          {facetValue?.name && (
            <Badge
              variant="muted"
              className="mr-[16px] min-w-fit border border-gray-200 bg-gray-100 px-[6px] py-[2px]"
            >
              {facets[facetName]?.name}: {facetValue?.display_name}
            </Badge>
          )}
          {/* search input*/}

          <CommandInput
            ref={inputRef}
            className="w-full grow rounded-[12px] border-0 py-[18px] pl-0 pr-[150px] focus:border-0 focus:ring-0 "
            onFocus={() => setShowCommandList(true)}
            placeholder="Find statistics, forecasts & studies"
            onInput={(e) => handleTyping((e.target as HTMLInputElement).value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleSubmit();
              }
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
            onClick={() => handleSubmit()}
            className="absolute right-[10px] top-[10px] flex gap-[8px]"
          >
            <SearchIcon width={15} />
            Search
          </Button>
        </div>
        <div className="flex w-full flex-col gap-2 md:flex-row md:items-center">
          <Link href="/search" className="mt-2 text-xs font-medium text-accent">
            Browse all datasets
          </Link>
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
                  badge={`${facets[facetName].name}: ${item.display_name}`}
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
                        {filteredIndicators.slice(0, 5).map((indicator, x) => (
                          <SearchFacetItem
                            key={`indicator-${x}`}
                            text={indicator.display_name}
                            onSelect={() => {
                              storeRecentSearch({
                                indicator: indicator,
                                query: {
                                  indicator: indicator.name,
                                },
                              });
                            }}
                            href={`/search?indicator=${indicator.name}`}
                            icon={
                              <VariableIcon
                                width={20}
                                className="min-w-[20px] text-gray-500"
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
                            className="recent-searches"
                            heading={
                              <CommandListHeader title="Recent searches" />
                            }
                          >
                            {storedSearches.map((recent) => {
                              const badge =
                                recent.facetValue && recent.facetName
                                  ? `${recent.facetName}: ${recent.facetValue}`
                                  : "";

                              const icon = recent.indicator ? (
                                <VariableIcon
                                  width={20}
                                  className="min-w-[20px] text-gray-500"
                                />
                              ) : null;

                              const context = recent.indicator
                                ? "Indicator"
                                : "";

                              const text =
                                recent.indicator?.display_name || recent.text;

                              const params = recent.query;

                              return (
                                <SearchFacetItem
                                  badge={badge}
                                  onSelect={() => {
                                    router.push({
                                      pathname: "/search",
                                      query: params,
                                    });
                                  }}
                                  text={text}
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
            </>
          )}
        </CommandList>
      </Command>
    </form>
  );
}
