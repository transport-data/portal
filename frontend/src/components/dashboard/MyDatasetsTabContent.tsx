import DashboardDatasetCard, {
  DatasetsCardsLoading,
} from "@components/_shared/DashboardDatasetCard";
import DatasetsFilter, { Facet } from "@components/_shared/DatasetsFilter";
import { SelectableItemsList } from "@components/ui/selectable-items-list";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { Dataset } from "@interfaces/ckan/dataset.interface";
import { useEffect, useState } from "react";
import { SearchDatasetType } from "@schema/dataset.schema";
import { searchDatasets } from "@utils/dataset";
import {
  DocumentReportIcon,
  DocumentSearchIcon,
  EyeOffIcon,
  GlobeAltIcon,
} from "@lib/icons";
import { api } from "@utils/api";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@components/ui/pagination";
import React from "react";
import { SearchPageOnChange } from "@pages/search";
import { cn } from "@lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

export default function MyDatasetsTabContent() {
  const { data: session } = useSession();
  const [contributors, setContributors] = useState<Facet[]>([]);
  const [updateFrequencies, setUpdateFrequencies] = useState<Facet[]>([]);
  const [tags, setTags] = useState<Facet[]>([]);
  const [orgs, setOrgs] = useState<Facet[]>([]);
  const [resourcesFormats, setResourcesFormats] = useState<Facet[]>([]);
  const [regions, setRegions] = useState<Facet[]>([]);
  const [countries, setCountries] = useState<Facet[]>([]);
  const [metadataCreatedDates, setMetadataCreatedDates] = useState<Facet[]>([]);
  const [visibility, setVisibility] = useState("*");
  const [currentPage, setCurrentPage] = useState(0);
  const { data: orgsForUser } = api.organization.listForUser.useQuery();
  const datasetsPerPage = 9;

  const [searchFilter, setSearchFilter] = useState<SearchDatasetType>({
    offset: 0,
    limit: datasetsPerPage,
    sort: "score desc, metadata_modified desc",
    includePrivate: true,
    includeDrafts: true,
    private: true,
    facetsFields: `["tags","frequency","regions", "geographies", "organization", "res_format", "metadata_created"]`,
    advancedQueries: [
      { key: "creator_user_id", values: [`${session?.user.id}`] },
    ],
  });

  const {
    isLoading,
    data: { datasets, count: datasetCount, facets } = {
      datasets: [],
      facets: {} as any,
    },
  } = api.dataset.search.useQuery(searchFilter);

  const pages = new Array(
    Math.ceil((datasetCount || 0) / datasetsPerPage)
  ).fill(0);

  const resetFilter = () => {
    setSearchFilter({
      offset: 0,
      limit: datasetsPerPage,
      sort: "score desc, metadata_modified desc",
      includePrivate: true,
      includeDrafts: true,
      advancedQueries: [
        { key: "creator_user_id", values: [`${session?.user.id}`] },
      ],
    });
    setVisibility("*");
    setCurrentPage(0);
  };

  const onChange: SearchPageOnChange = (data) => {
    setSearchFilter((oldValue) => {
      const updatedValue: any = { ...oldValue, offset: 0 };
      data.forEach((x) => (updatedValue[x.key] = x.value));
      return updatedValue;
    });
    setCurrentPage(0);
  };

  useEffect(() => {
    for (const key in facets) {
      switch (key) {
        case "contributors": {
          if (!contributors.length) setContributors(facets[key].items);
          break;
        }
        case "organization": {
          if (!orgs.length)
            setOrgs(
              facets[key].items?.filter((item: any) =>
                orgsForUser?.map((org) => org.name)?.includes(item?.name)
              )
            );
          break;
        }
        case "tags": {
          if (!tags.length) setTags(facets[key].items);
          break;
        }
        case "geographies": {
          if (!countries.length) setCountries(facets[key].items);
          break;
        }
        case "regions": {
          if (!regions.length) setRegions(facets[key].items);
          break;
        }
        case "res_format": {
          if (!resourcesFormats.length) setResourcesFormats(facets[key].items);
          break;
        }

        case "frequency": {
          if (!updateFrequencies.length)
            setUpdateFrequencies(facets[key].items);
          break;
        }
        case "metadata_created": {
          const countByYear = new Map<string, number>();
          const LAST_MONTH_KEY = "Last month";
          const setYearsCoverage = (map: Map<string, number>) => {
            const data = Array.from(map.keys()).map((k) => {
              return {
                name: k,
                display_name: k,
                count: map.get(k) || 0,
              };
            });
            const [lastMonthFacet] = data.splice(
              data.findIndex((x) =>
                x.display_name.toLowerCase().includes("last")
              ),
              1
            );

            data.sort(
              (a, b) => Number(a.display_name) - Number(b.display_name)
            );
            data.splice(1, 0, lastMonthFacet!);
            setMetadataCreatedDates(data);
          };

          facets[key].items.forEach((x: any) => {
            const dateConverted = new Date(x.name);
            const today = new Date();
            let _key;
            // this is checking if the dataset was created at December of last year and today is January making the dataset be in last month filter
            if (
              today.getFullYear() - dateConverted.getFullYear() === 1 &&
              today.getMonth() === 0 &&
              dateConverted.getMonth() === 11
            ) {
              _key = LAST_MONTH_KEY;
            } else {
              _key =
                dateConverted.getFullYear() === today.getFullYear() &&
                dateConverted.getMonth() === today.getMonth() - 1
                  ? LAST_MONTH_KEY
                  : x.name.slice(0, 4);
            }

            let count = countByYear.get(_key);
            if (!count) {
              countByYear.set(_key, x.count);
            } else {
              countByYear.set(_key, count + x.count);
            }
          });
          countByYear.set(
            new Date().getFullYear().toString(),
            (countByYear.get(new Date().getFullYear().toString()) ?? 0) +
              (countByYear.get(LAST_MONTH_KEY) ?? 0)
          );

          if (!countByYear.get(LAST_MONTH_KEY)) {
            countByYear.set(LAST_MONTH_KEY, 0);
          }

          setYearsCoverage(countByYear);
          break;
        }
        default: {
          break;
        }
      }
    }
  }, [facets, orgsForUser]);

  return (
    <div className=" flex flex-col justify-between gap-4 sm:flex-row sm:gap-8">
      <div className="order-1 space-y-12 lg:max-w-[150px]">
        <SelectableItemsList
          items={[
            {
              icon: <DocumentReportIcon />,
              isSelected: true,
              text: "All",
              value: "*",
            },
            {
              icon: <GlobeAltIcon />,
              isSelected: false,
              text: "Public",
              value: "public",
            },
            {
              icon: <EyeOffIcon />,
              isSelected: false,
              text: "Private",
              value: "private",
            },
            {
              icon: <DocumentSearchIcon />,
              isSelected: false,
              text: "Drafts",
              value: "draft",
            },
          ]}
          onSelectedItem={(selected) => {
            setSearchFilter((_value) => ({
              ..._value,
              ...(selected === "public"
                ? {
                    includePrivate: false,
                    includeDrafts: false,
                    advancedQueries: [
                      //preserve other advancedQueries and remove "state" and "private"
                      ...(_value.advancedQueries ?? []).filter(
                        (aq) => aq.key !== "state" && aq.key !== "private"
                      ),
                      ...[{ key: "private", values: ["(false)"] }],
                    ],
                  }
                : selected === "private"
                ? {
                    includePrivate: true,
                    includeDrafts: false,
                    advancedQueries: [
                      //preserve other advancedQueries and remove "state" and "private"
                      ...(_value.advancedQueries ?? []).filter(
                        (aq) => aq.key !== "state" && aq.key !== "private"
                      ),
                      ...[{ key: "private", values: ["(true)"] }],
                    ],
                  }
                : selected === "draft"
                ? {
                    includeDrafts: true,
                    includePrivate: false,
                    advancedQueries: [
                      //preserve other advancedQueries and remove "state" and "private"
                      ...(_value.advancedQueries ?? []).filter(
                        (aq) => aq.key !== "state" && aq.key !== "private"
                      ),
                      ...[
                        { key: "state", values: ["draft"] },
                        { key: "private", values: ["(false)"] },
                      ],
                    ],
                  }
                : {
                    includeDrafts: true,
                    includePrivate: true,
                    advancedQueries: [
                      //preserve other advancedQueries and remove "state" and "private"
                      ...(_value.advancedQueries ?? []).filter(
                        (aq) => aq.key !== "state" && aq.key !== "private"
                      ),
                    ],
                  }),
              offset: 0,
            }));
            setCurrentPage(0);
            setVisibility(selected);
          }}
          selected={visibility}
          title="Categories"
        />
        <div className="space-y-2.5 lg:hidden">
          <DatasetsFilter
            resetFilter={resetFilter}
            datasetCount={datasetCount || 0}
            onChange={onChange}
            searchFilter={searchFilter}
            defaultStartValue={searchFilter.startYear}
            defaultEndValue={searchFilter.endYear}
            tags={tags}
            orgs={orgs}
            resourcesFormats={resourcesFormats}
            regions={regions}
            countries={countries}
            metadataCreatedDates={metadataCreatedDates}
          />
        </div>
      </div>
      <div className="order-3 w-full sm:order-2 md:max-w-[556px] xl:max-w-[700px]">
        <h3 className="mb-4 text-sm font-semibold">Timeline</h3>
        <section className="flex flex-col gap-4">
          {isLoading ? (
            <DatasetsCardsLoading />
          ) : (
            <>
              {datasets?.length > 0 ? (
                datasets?.map((x) => (
                  <DashboardDatasetCard
                    key={x.id}
                    {...(x as Dataset)}
                    canEdit={true}
                  />
                ))
              ) : (
                <div className="text-[14px]">No datasets found...</div>
              )}

              {pages.length > datasetsPerPage ? (
                <Pagination className="mx-0 my-8 justify-start">
                  <PaginationContent>
                    <PaginationItem>
                      <button
                        disabled={currentPage === 0}
                        aria-label="Go to previous page"
                        className={cn(
                          "flex h-8 cursor-pointer items-center justify-center border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700",
                          "rounded-s-lg px-2",
                          currentPage === 0 ? "cursor-not-allowed" : ""
                        )}
                        onClick={() => {
                          setSearchFilter((oldV) => ({
                            ...oldV,
                            offset: (currentPage - 1) * datasetsPerPage,
                          }));
                          setCurrentPage((oldV) => oldV - 1);
                        }}
                      >
                        <ChevronLeftIcon className="h-4 w-4" />
                      </button>
                    </PaginationItem>
                    {pages.map((x, i) =>
                      i > currentPage + 2 || i < currentPage - 2 ? null : (
                        <PaginationItem key={`pagination-item-${i}`}>
                          <button
                            disabled={currentPage === i}
                            onClick={() => {
                              setSearchFilter((oldV) => ({
                                ...oldV,
                                offset: i * datasetsPerPage,
                              }));
                              setCurrentPage(i);
                            }}
                            className={cn(
                              `flex h-8 cursor-pointer items-center justify-center border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 `,
                              currentPage === i ? "cursor-auto bg-gray-100" : ""
                            )}
                          >
                            {i + 1}
                          </button>
                        </PaginationItem>
                      )
                    )}
                    <PaginationItem>
                      <button
                        disabled={currentPage === pages.length - 1}
                        aria-label="Go to next page"
                        onClick={() => {
                          setSearchFilter((oldV) => ({
                            ...oldV,
                            offset: (currentPage + 1) * datasetsPerPage,
                          }));
                          setCurrentPage((oldV) => oldV + 1);
                        }}
                        className={cn(
                          "flex h-8 cursor-pointer items-center justify-center border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700",
                          "rounded-e-lg px-2",
                          currentPage === pages.length - 1
                            ? "cursor-not-allowed"
                            : ""
                        )}
                      >
                        <ChevronRightIcon className="h-4 w-4" />
                      </button>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              ) : (
                <></>
              )}
            </>
          )}
        </section>
      </div>
      <div className="order-2 hidden w-full space-y-2.5 border-b-[1px] pt-3 sm:order-3 sm:max-w-[340px] sm:border-b-0 sm:border-l-[1px] sm:pl-3 lg:block">
        <DatasetsFilter
          resetFilter={resetFilter}
          datasetCount={datasetCount || 0}
          onChange={onChange}
          searchFilter={searchFilter}
          defaultStartValue={searchFilter.startYear}
          defaultEndValue={searchFilter.endYear}
          tags={tags}
          orgs={orgs}
          resourcesFormats={resourcesFormats}
          regions={regions}
          countries={countries}
          metadataCreatedDates={metadataCreatedDates}
        />
      </div>
    </div>
  );
}
