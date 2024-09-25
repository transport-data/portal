import DatasetsFilter, { Facet } from "@components/_shared/DatasetsFilter";
import QuickFilterDropdown from "@components/ui/quick-filter-dropdown";
import Head from "next/head";
import { useState } from "react";
import Layout from "../components/_shared/Layout";

import DatasetSearchItem from "@components/search/DatasetSearchItem";
import SearchBar from "@components/search/SearchBar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@components/ui/pagination";
import { cn } from "@lib/utils";
import { SearchDatasetsType } from "@schema/dataset.schema";
import { api } from "@utils/api";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function getServerSideProps({ query }: any) {
  return {
    props: query,
  };
}

export default function DatasetSearch({
  query,
  sector,
  mode,
  service,
  region,
  fuel,
  before,
  after,
  country,
}: any) {
  let modes: Facet[] = [];
  let services: Facet[] = [];
  let updateFrequencies: Facet[] = [];
  let tags: Facet[] = [];
  let sectors: Facet[] = [];
  let orgs: Facet[] = [];
  let resourcesFormats: Facet[] = [];
  let regions: Facet[] = [];
  let countries: Facet[] = [];
  let metadataCreatedDates: Facet[] = [];
  let yearsCoverage: Facet[] = [];

  const resetFilter = () => {
    setSearchFilter({
      offset: 0,
      limit: 9,
      sort: "score desc, metadata_modified desc",
      facetsFields: `["tags", "groups", "services", "modes", "sectors","frequency","regions", "geographies", "organization", "res_format", "temporal_coverage_start", "temporal_coverage_end", "metadata_created"]`,
    });
    setCurrentPage(0);
  };

  const [searchFilter, setSearchFilter] = useState<SearchDatasetsType>({
    offset: 0,
    limit: 9,
    endYear: after ? Number(after) : undefined,
    mode: mode as string | undefined,
    service: service as string | undefined,
    sector: sector as string | undefined,
    fuel: fuel as string | undefined,
    before: before as string | undefined,
    after: after as string | undefined,
    regions: region ? [region as string] : undefined,
    countries: country ? [country as string] : undefined,
    query: query as string,
    sort: "score desc, metadata_modified desc",
    facetsFields: `["tags", "groups", "services", "modes", "sectors","frequency","regions", "geographies", "organization", "res_format", "temporal_coverage_start", "temporal_coverage_end", "metadata_created"]`,
  });

  const [currentPage, setCurrentPage] = useState(0);
  const {
    data: { datasets, count: datasetCount, facets } = {
      datasets: [],
      facets: {} as any,
    },
  } = api.dataset.search.useQuery(searchFilter);

  for (const key in facets) {
    switch (key) {
      case "organization": {
        orgs = facets[key].items;
        break;
      }
      case "tags": {
        tags = facets[key].items;
        break;
      }
      case "geographies": {
        countries = facets[key].items;
        break;
      }
      case "regions": {
        regions = facets[key].items;
        break;
      }
      case "res_format": {
        resourcesFormats = facets[key].items;
        break;
      }
      case "metadata_created": {
        const createdByYear = new Map<string, number>();
        let totalCount = 0;
        for (let i = 0; i < facets[key].items.length; i++) {
          const x = facets[key].items[i];
          const dateConverted = new Date(x.name);
          const today = new Date();
          const _key =
            dateConverted.getFullYear() === today.getFullYear() &&
            dateConverted.getMonth() === today.getMonth() - 1
              ? "Last month"
              : dateConverted.getFullYear().toString();
          let count = createdByYear.get(_key);
          if (!count) {
            createdByYear.set(_key, x.count);
          } else {
            count += x.count;
            createdByYear.set(_key, count!);
          }

          totalCount += x.count;
        }

        metadataCreatedDates = Array.from(createdByYear.keys()).map(
          (k) =>
            ({
              name: k,
              display_name: k,
              count: createdByYear.get(k),
            } as Facet)
        );
        metadataCreatedDates.unshift({
          name: "*",
          display_name: "All",
          count: totalCount,
        });

        break;
      }
      case "modes": {
        modes = facets[key].items;
        break;
      }
      case "services": {
        services = facets[key].items;
        break;
      }
      case "frequency": {
        updateFrequencies = facets[key].items;
        break;
      }
      case "sectors": {
        sectors = facets[key].items;
        break;
      }
      case "temporal_coverage_end":
      case "temporal_coverage_start": {
        const countByYear = new Map<string, number>();
        const setYearsCoverage = (map: Map<string, number>) => {
          yearsCoverage.push(
            ...Array.from(map.keys()).map((k) => {
              const date = new Date();
              date.setFullYear(Number(k));
              date.setDate(1);
              date.setMonth(0);
              return {
                name: date.toLocaleDateString("en-US").replaceAll("/", "-"),
                display_name: k,
                count: map.get(k),
              } as Facet;
            })
          );
        };

        const addDataToMap = (x: any, map: Map<string, number>) => {
          const _key = x.name.slice(0, 4);
          let count = map.get(_key);
          if (!count) {
            map.set(_key, x.count);
          } else {
            map.set(_key, count + x.count);
          }
        };

        facets[key].items.forEach((x: any) => addDataToMap(x, countByYear));

        if (yearsCoverage.length) {
          yearsCoverage.forEach((x) => {
            const year = new Date(x.name).getFullYear().toString();
            const countFound = countByYear.get(year);
            if (countFound) {
              x.count = x.count + countFound;
              countByYear.delete(year);
            }
          });
          setYearsCoverage(countByYear);
          yearsCoverage.sort(
            (a, b) => Number(a.display_name) - Number(b.display_name)
          );
        } else {
          setYearsCoverage(countByYear);
        }

        break;
      }
      default: {
        break;
      }
    }
  }

  const onChange = (
    value: string[] | boolean | string | undefined,
    key: keyof SearchDatasetsType
  ) => {
    setSearchFilter((oldValue) => {
      const updatedValue: any = { ...oldValue, offset: 0 };
      updatedValue[key] = value;
      return updatedValue;
    });
    setCurrentPage(0);
  };

  const pages = new Array(Math.ceil((datasetCount || 0) / 9)).fill(0);

  return (
    <>
      <Head>
        <title>Datasets</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout backgroundEffect effectSize="100px">
        <div className="container">
          <div className="pt-5">
            <SearchBar
              onSubmit={(data) =>
                setSearchFilter((old) => ({ ...old, query: data.query }))
              }
              onChange={onChange}
              resetFilter={resetFilter}
              hideDatasetSuggestion
              query={searchFilter.query || ""}
              facetName={
                (searchFilter.sector
                  ? "sector"
                  : searchFilter.mode
                  ? "mode"
                  : searchFilter.regions?.at(0)
                  ? "region"
                  : searchFilter.after
                  ? "after"
                  : searchFilter.fuel
                  ? "fuel"
                  : searchFilter.before
                  ? "before"
                  : searchFilter.service
                  ? "service"
                  : undefined) as keyof SearchDatasetsType
              }
              facetValue={
                searchFilter.sector
                  ? searchFilter.sector
                  : searchFilter.mode
                  ? searchFilter.mode
                  : searchFilter.regions?.at(0)
                  ? searchFilter.regions.at(0)
                  : searchFilter.after
                  ? searchFilter.after
                  : searchFilter.fuel
                  ? searchFilter.fuel
                  : searchFilter.before
                  ? searchFilter.before
                  : searchFilter.service
                  ? searchFilter.service
                  : undefined
              }
            />
          </div>
          <div className="mt-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:gap-[64px]">
              <div className="mb-8 flex w-full flex-col justify-between">
                <div>
                  <div className="flex flex-col flex-wrap items-center justify-between gap-2 md:flex-row xl:flex-nowrap">
                    <div className="flex flex-col items-center gap-4 md:flex-row">
                      <span className="text-base font-medium text-gray-900">
                        Quick filters:
                      </span>
                      <div className="flex flex-wrap items-center gap-2 sm:flex-row sm:flex-nowrap">
                        <QuickFilterDropdown
                          searchFilter={searchFilter}
                          onChange={onChange}
                          defaultValue={searchFilter.sector}
                          text="Sector"
                          filterFieldName="sector"
                          items={sectors}
                        />
                        <QuickFilterDropdown
                          searchFilter={searchFilter}
                          onChange={onChange}
                          text="Mode"
                          filterFieldName="mode"
                          defaultValue={searchFilter.mode}
                          items={modes}
                        />
                        <QuickFilterDropdown
                          searchFilter={searchFilter}
                          onChange={onChange}
                          text="Service"
                          filterFieldName="service"
                          defaultValue={searchFilter.service}
                          items={services}
                        />
                        <QuickFilterDropdown
                          searchFilter={searchFilter}
                          onChange={onChange}
                          defaultValue={
                            searchFilter.regions ? searchFilter.regions[0] : "*"
                          }
                          text="Region"
                          filterFieldName="regions"
                          isCheckbox
                          items={regions}
                        />
                        <div className="w-full sm:hidden">
                          <QuickFilterDropdown
                            searchFilter={searchFilter}
                            onChange={onChange}
                            hideAllOption
                            defaultValue={searchFilter.sort}
                            text="Sort by"
                            filterFieldName="sort"
                            items={[
                              {
                                display_name: "Relevance",
                                name: "score desc, metadata_modified desc",
                                count: 0,
                              },
                              {
                                display_name: "Name Ascending",
                                name: "name asc",
                                count: 0,
                              },
                              {
                                display_name: "Name Descending",
                                name: "name desc",
                                count: 0,
                              },
                              {
                                display_name: "Last Modified",
                                name: "metadata_modified desc",
                                count: 0,
                              },
                            ]}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="hidden sm:block">
                      <QuickFilterDropdown
                        searchFilter={searchFilter}
                        onChange={onChange}
                        hideAllOption
                        defaultValue={searchFilter.sort}
                        text="Sort by"
                        filterFieldName="sort"
                        items={[
                          {
                            display_name: "Relevance",
                            count: 0,
                            name: "score desc, metadata_modified desc",
                          },
                          {
                            count: 0,
                            display_name: "Name Ascending",
                            name: "name asc",
                          },
                          {
                            count: 0,
                            display_name: "Name Descending",
                            name: "name desc",
                          },
                          {
                            count: 0,
                            display_name: "Last Modified",
                            name: "metadata_modified desc",
                          },
                        ]}
                      />
                    </div>
                  </div>
                  <section className="mt-8">
                    <div className="flex flex-col gap-8">
                      {datasets.map((item, i) => (
                        <DatasetSearchItem
                          frequencies={updateFrequencies}
                          key={`dataset-result-${i}`}
                          {...item}
                        />
                      ))}
                    </div>
                  </section>
                </div>
                <Pagination className="mx-0 mt-8 justify-start">
                  <PaginationContent>
                    <PaginationItem>
                      <button
                        disabled={currentPage === 0}
                        aria-label="Go to next page"
                        className={cn(
                          "flex h-8 cursor-pointer items-center justify-center border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700",
                          "rounded-s-lg px-2",
                          currentPage === 0 ? "cursor-not-allowed" : ""
                        )}
                        onClick={() => {
                          setSearchFilter((oldV) => ({
                            ...oldV,
                            offset: (currentPage - 1) * 9,
                          }));
                          setCurrentPage((oldV) => oldV - 1);
                        }}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                    </PaginationItem>
                    {pages.map((x, i) =>
                      i > currentPage + 2 || i < currentPage - 2 ? (
                        <></>
                      ) : (
                        <PaginationItem>
                          <button
                            disabled={currentPage === i}
                            onClick={() => {
                              setSearchFilter((oldV) => ({
                                ...oldV,
                                offset: i * 9,
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
                            offset: (currentPage + 1) * 9,
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
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>

              <div className="order-first w-full border-l pl-5 pt-[12px] lg:order-last lg:max-w-[340px]">
                <DatasetsFilter
                  resetFilter={resetFilter}
                  datasetCount={datasetCount || 0}
                  onChange={onChange}
                  searchFilter={searchFilter}
                  metadataCreatedDates={metadataCreatedDates}
                  {...{
                    tags,
                    orgs,
                    resourcesFormats,
                    regions,
                    countries,
                    yearsCoverage,
                    modes,
                    services,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export const Checkboxes = ({
  spaceCount,
  onChange,
  items,
  removeCount,
  selectedItems = [],
  limitToPresentViewAll,
}: {
  items: Facet[];
  selectedItems?: string[];
  limitToPresentViewAll?: number;
  spaceCount?: boolean;
  removeCount?: boolean;
  onChange: (v: string[]) => void;
}) => {
  return (
    <>
      {items.map((x, index) =>
        index <= (limitToPresentViewAll ?? 999999 * 999999) ? (
          <div className="flex items-center gap-2 text-sm text-[#6B7280]">
            <input
              onChange={() => {
                const itemsCopy = [...selectedItems];
                if (itemsCopy.includes(x.name)) itemsCopy.splice(index);
                else itemsCopy.push(x.name);
                onChange([...itemsCopy]);
              }}
              checked={selectedItems.includes(x.name)}
              className="remove-input-ring rounded text-[#006064]"
              type="checkbox"
            />
            <label
              className={spaceCount ? "flex w-full justify-between" : ""}
              htmlFor=""
            >
              {x.display_name}{" "}
              {!removeCount && (
                <>
                  {spaceCount ? <span>{`(${x.count})`}</span> : `(${x.count})`}
                </>
              )}
            </label>
          </div>
        ) : index === 8 ? (
          <span className="mt-[1px] cursor-pointer text-[#006064]">
            View all
          </span>
        ) : (
          <></>
        )
      )}
    </>
  );
};
