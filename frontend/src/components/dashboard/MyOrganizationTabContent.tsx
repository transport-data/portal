import { DatasetsCardsLoading } from "@components/_shared/DashboardDatasetCard";
import DashboardDatasetCard from "@components/_shared/DashboardDatasetCard";
import DatasetsFilter, { Facet } from "@components/_shared/DatasetsFilter";
import UserAvatar from "@components/_shared/UserAvatar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@components/ui/pagination";
import { SelectableItemsList } from "@components/ui/selectable-items-list";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { Dataset } from "@interfaces/ckan/dataset.interface";
import {
  DocumentReportIcon,
  DocumentSearchIcon,
  EyeOffIcon,
  GlobeAltIcon,
} from "@lib/icons";
import { cn } from "@lib/utils";
import { SearchPageOnChange } from "@pages/search";
import { SearchDatasetType } from "@schema/dataset.schema";
import { api } from "@utils/api";
import { useEffect, useState } from "react";
import JoinOrganizationModalButton from "./JoinOrganizationModal";
import { useUserGlobalOrganizationRoles } from "@hooks/user";
import { listGroups } from "@utils/group";

const DATASETS_PER_PAGE = 9;
const FACET_FIELDS = `["tags","frequency", "organization", "res_format", "metadata_created"]`

export async function getServerSideProps({ session }: any) {
  const regions: Facet[] = [];
  const countries: Facet[] = [];

  const geographies = await listGroups({
    type: "geography",
    apiKey: session?.user.apikey ?? "",
  });

  geographies.forEach((x: any) =>
    x.geography_type === "country"
      ? countries.push({ count: 0, display_name: x.title, name: x.name })
      : regions.push({ count: 0, display_name: x.title, name: x.name })
  );

  return {
    props: { countries, regions },
  };
}


export default ({countries, regions}: any) => {
  const [contributors, setContributors] = useState<Facet[]>([]);
  const [updateFrequencies, setUpdateFrequencies] = useState<Facet[]>([]);
  const [tags, setTags] = useState<Facet[]>([]);
  const [orgs, setOrgs] = useState<Facet[]>([]);
  const [resourcesFormats, setResourcesFormats] = useState<Facet[]>([]);
  const [metadataCreatedDates, setMetadataCreatedDates] = useState<Facet[]>([]);
  const [visibility, setVisibility] = useState("*");
  const [contributor, setContributor] = useState("*");
  const [currentPage, setCurrentPage] = useState(0);

  const { belongsToAnyOrg, userOrgs } = useUserGlobalOrganizationRoles();

  const [searchFilter, setSearchFilter] = useState<SearchDatasetType>({
    offset: 0,
    limit: belongsToAnyOrg ? DATASETS_PER_PAGE : 0,
    sort: "score desc, metadata_modified desc",
    includePrivate: true,
    includeDrafts: true,
    facetsFields: FACET_FIELDS,
  });

  const {
    isLoading,
    data: { datasets, count, facets } = {
      datasets: [],
      facets: {} as any,
    },
  } = api.dataset.search.useQuery({
    ...searchFilter,
    orgs:
      searchFilter.orgs?.length === 0
        ? orgs.map((o) => o.name)
        : searchFilter.orgs,
  });

  const datasetCount = belongsToAnyOrg ? count : 0;

  const pages = new Array(
    Math.ceil((datasetCount || 0) / DATASETS_PER_PAGE),
  ).fill(0);

  const resetFilter = () => {
    setSearchFilter({
      offset: 0,
      limit: belongsToAnyOrg ? DATASETS_PER_PAGE : 0,
      sort: "score desc, metadata_modified desc",
      includePrivate: true,
      includeDrafts: true,
      orgs: [],
    });
    setVisibility("*");
    setContributor("*");
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
    if (orgs.length)
      setSearchFilter((_value) => ({
        ..._value,
        limit: DATASETS_PER_PAGE,
        orgs: [],
      }));
  }, [orgs]);

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
                userOrgs?.map((org) => org.name)?.includes(item?.name),
              ),
            );
          break;
        }
        case "tags": {
          if (!tags.length) setTags(facets[key].items);
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
                x.display_name.toLowerCase().includes("last"),
              ),
              1,
            );

            data.sort(
              (a, b) => Number(a.display_name) - Number(b.display_name),
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
              (countByYear.get(LAST_MONTH_KEY) ?? 0),
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
  }, [facets, userOrgs]);

  return (
    <div className=" flex flex-col justify-between gap-4 sm:flex-row sm:gap-8">
      <div className="order-1 space-y-12 text-ellipsis lg:max-w-[150px]">
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
                        (aq) => aq.key !== "state" && aq.key !== "private",
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
                          (aq) => aq.key !== "state" && aq.key !== "private",
                        ),
                        ...[{ key: "private", values: ["(true)"] }],
                      ],
                    }
                  : selected === "draft"
                    ? {
                        includeDrafts: true,
                        includePrivate: true,
                        advancedQueries: [
                          //preserve other advancedQueries and remove "state"
                          ...(_value.advancedQueries ?? []).filter(
                            (aq) => aq.key !== "state",
                          ),
                          ...[{ key: "state", values: ["draft"] }],
                        ],
                      }
                    : {
                        includeDrafts: true,
                        includePrivate: true,
                        advancedQueries: [
                          //preserve other advancedQueries and remove "state" and "private"
                          ...(_value.advancedQueries ?? []).filter(
                            (aq) => aq.key !== "state" && aq.key !== "private",
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
        <SelectableItemsList
          items={[
            {
              isSelected: true,
              value: "*",
              text: "All",
              icon: <DocumentReportIcon />,
            },
            ...(contributors?.length ? contributors : [])?.map((c: any) => ({
              icon: (
                <UserAvatar
                  className="text-[8px]"
                  image={c.display_image}
                  name={c.display_name}
                />
              ),
              text: c.display_name as string,
              value: c.name as string,
              isSelected: false,
            })),
          ]}
          onSelectedItem={(v) => {
            setSearchFilter((_value) => ({
              ..._value,
              ...{
                advancedQueries: [
                  ...(_value.advancedQueries ?? []).filter(
                    (aq) => aq.key !== "contributors",
                  ),
                  ...(v === "*" ? [] : [{ key: "contributors", values: [v] }]),
                ],
              },
              offset: 0,
            }));
            setCurrentPage(0);
            setContributor(v);
          }}
          selected={contributor}
          title="Contributors"
        />
        <div className="space-y-2.5 lg:hidden">
          <DatasetsFilter
            resetFilter={resetFilter}
            datasetCount={datasetCount ?? 0}
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
              {!belongsToAnyOrg && (
                <JoinOrganizationModalButton
                  render={(setIsShow) => {
                    return (
                      <p className="text-[14px]">
                        You are not a member of an organisation yet.{" "}
                        <button
                          onClick={() => setIsShow(true)}
                          className="font-semibold text-accent underline"
                        >
                          Click here
                        </button>{" "}
                        to request to join an organisation or request the
                        creation of a new one.
                      </p>
                    );
                  }}
                />
              )}
              {!!(belongsToAnyOrg && datasets?.length > 0) &&
                datasets?.map((x) => {
                  const org = userOrgs?.find(
                    (org) => org.name === x.organization?.name,
                  );
                  const role = org?.capacity;
                  const canEdit = role === "admin" || role === "editor";
                  return (
                    <DashboardDatasetCard
                      key={x.id}
                      {...(x as Dataset)}
                      canEdit={canEdit}
                    />
                  );
                })}

              {!!(belongsToAnyOrg && datasets?.length == 0) && (
                <div className="text-[14px]">No datasets found...</div>
              )}

              {pages.length ? (
                <Pagination className="mx-0 my-8 justify-start">
                  <PaginationContent>
                    <PaginationItem>
                      <button
                        disabled={currentPage === 0}
                        aria-label="Go to previous page"
                        className={cn(
                          "flex h-8 cursor-pointer items-center justify-center border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700",
                          "rounded-s-lg px-2",
                          currentPage === 0 ? "cursor-not-allowed" : "",
                        )}
                        onClick={() => {
                          setSearchFilter((oldV) => ({
                            ...oldV,
                            offset: (currentPage - 1) * DATASETS_PER_PAGE,
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
                                offset: i * DATASETS_PER_PAGE,
                              }));
                              setCurrentPage(i);
                            }}
                            className={cn(
                              `flex h-8 cursor-pointer items-center justify-center border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 `,
                              currentPage === i
                                ? "cursor-auto bg-gray-100"
                                : "",
                            )}
                          >
                            {i + 1}
                          </button>
                        </PaginationItem>
                      ),
                    )}
                    <PaginationItem>
                      <button
                        disabled={currentPage === pages.length - 1}
                        aria-label="Go to next page"
                        onClick={() => {
                          setSearchFilter((oldV) => ({
                            ...oldV,
                            offset: (currentPage + 1) * DATASETS_PER_PAGE,
                          }));
                          setCurrentPage((oldV) => oldV + 1);
                        }}
                        className={cn(
                          "flex h-8 cursor-pointer items-center justify-center border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700",
                          "rounded-e-lg px-2",
                          currentPage === pages.length - 1
                            ? "cursor-not-allowed"
                            : "",
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
          datasetCount={datasetCount ?? 0}
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
};
