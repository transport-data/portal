import { DatasetsCardsLoading } from "@components/_shared/DashboardDatasetCard";
import DashboardDatasetCard from "@components/_shared/DashboardDatasetCardOld";
import DatasetsFilter, { Facet } from "@components/_shared/DatasetsFilter";
import DatasetsFilterMocked from "@components/_shared/DatasetsFilterMocked";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@components/ui/pagination";
import { SelectableItemsList } from "@components/ui/selectable-items-list";
import { DocumentReportIcon, EyeOffIcon, GlobeAltIcon } from "@lib/icons";
import { SearchPageOnChange } from "@pages/search";
import { SearchDatasetType } from "@schema/dataset.schema";
import { Organization } from "@schema/organization.schema";
import { api } from "@utils/api";
import { useEffect, useState } from "react";

export default () => {
  const [modes, setModes] = useState<Facet[]>([]);
  const [services, setServices] = useState<Facet[]>([]);
  const [updateFrequencies, setUpdateFrequencies] = useState<Facet[]>([]);
  const [tags, setTags] = useState<Facet[]>([]);
  const [sectors, setSectors] = useState<Facet[]>([]);
  const [orgs, setOrgs] = useState<Facet[]>([]);
  const [resourcesFormats, setResourcesFormats] = useState<Facet[]>([]);
  const [regions, setRegions] = useState<Facet[]>([]);
  const [countries, setCountries] = useState<Facet[]>([]);
  const [metadataCreatedDates, setMetadataCreatedDates] = useState<Facet[]>([]);
  const [yearsCoverage, setYearsCoverage] = useState<Facet[]>([]);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);

  const resetFilter = () => {
    setSearchFilter({
      offset: 0,
      limit: 9,
      sort: "score desc, metadata_modified desc",
      facetsFields: `["tags", "groups", "services", "modes", "sectors","frequency","regions", "geographies", "organization", "res_format", "metadata_created"]`,
    });
    setCurrentPage(0);
  };

  const [visibility, setVisibility] = useState("All");
  const [contributor, setContributor] = useState("All");
  const { data: orgsForUser } = api.organization.listForUser.useQuery();
  const contributors: any = [];
  const datasetsPerPage = 20;
  const [userOrganizationsList, setUserOrganizationsList] = useState<
    (Organization & {
      groups: Array<{
        id: string;
        name: string;
      }>;
    } & {
      capacity: "admin" | "editor" | "member";
    })[]
  >();

  const [searchFilter, setSearchFilter] = useState<SearchDatasetType>({
    offset: 0,
    limit: 9,
    sort: "score desc, metadata_modified desc",
    includePrivate: true,
    includeDrafts: true,
    facetsFields: `["tags", "groups", "services", "modes", "sectors","frequency","regions", "geographies", "organization", "res_format", "metadata_created", "contributors"]`,
    orgs: orgsForUser?.map((org) => org.id),
  });

  const [currentPage, setCurrentPage] = useState(1);
  const {
    isLoading,
    data: { datasets, count: datasetCount, facets } = {
      datasets: [],
      facets: {} as any,
    },
  } = api.dataset.search.useQuery(searchFilter);

  const onChange: SearchPageOnChange = (data) => {
    setSearchFilter((oldValue) => {
      const updatedValue: any = { ...oldValue, offset: 0 };
      data.forEach((x) => (updatedValue[x.key] = x.value));
      return updatedValue;
    });
    setCurrentPage(0);
  };

  useEffect(() => {
    if (orgsForUser)
      setSearchFilter((_value) => ({
        ..._value,
        orgs: orgsForUser?.map((org) => org.name),
      }));
  }, [orgsForUser]);

  useEffect(() => {
    for (const key in facets) {
      switch (key) {
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
        case "modes": {
          if (!modes.length) setModes(facets[key].items);
          break;
        }
        case "services": {
          if (!services.length) setServices(facets[key].items);
          break;
        }
        case "frequency": {
          if (!updateFrequencies.length)
            setUpdateFrequencies(facets[key].items);
          break;
        }
        case "sectors": {
          if (!sectors.length) setSectors(facets[key].items);
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

  /*const organizations = orgsForUser?.map((org, x) => {
    const { data: orgData } = api.organization.get.useQuery({
      name: org?.name ?? "",
      includeUsers: true,
    });
    orgData?.users?.forEach((user) => {
      contributors.push({
        icon: <UserAvatar user={user as User} />,
        value: user.display_name as string,
        isSelected: false,
      });
    });
    return orgData;
  });*/
  /* const options: SearchDatasetType = {
    offset: offset,
    limit: datasetsPerPage,
    includePrivate: true,
    includeDrafts: true,
    orgs: orgsForUser?.map((o) => o?.name) || [],
  };*/

  // const { data, isLoading } = api.dataset.search.useQuery(options);

  const totalDatasets = datasetCount ?? 0;

  const totalPages = Math.ceil(totalDatasets ?? 0 / datasetsPerPage);

  return (
    <div className=" flex flex-col justify-between gap-4 sm:flex-row sm:gap-8">
      <div className="order-1 space-y-12 lg:min-w-[150px]">
        <SelectableItemsList
          items={[
            {
              icon: <DocumentReportIcon />,
              isSelected: true,
              value: "All",
            },
            {
              icon: <GlobeAltIcon />,
              isSelected: false,
              value: "Public",
            },
            {
              icon: <EyeOffIcon />,
              isSelected: false,
              value: "Drafts",
            },
          ]}
          onSelectedItem={(option) => setVisibility(option)}
          selected={visibility}
          title="Categories"
        />
        <SelectableItemsList
          items={[
            {
              isSelected: true,
              value: "All",
              icon: <DocumentReportIcon />,
            },
            ...(contributors ?? []),
          ]}
          onSelectedItem={(v) => setContributor(v)}
          selected={contributor}
          title="Contributors"
        />
        <div className="space-y-2.5 lg:hidden">
          <DatasetsFilterMocked />
        </div>
      </div>
      <div className="order-3 w-fit w-full sm:order-2">
        <h3 className="mb-4 text-sm font-semibold">Timeline</h3>
        <section className="flex flex-col gap-4">
          {isLoading ? (
            <DatasetsCardsLoading />
          ) : (
            <>
              {datasets
                ?.filter((item) =>
                  visibility === "Drafts"
                    ? item.state === "draft"
                    : visibility === "Public"
                    ? item.state === "active"
                    : true
                )
                ?.map((x) => (
                  <DashboardDatasetCard {...(x as any)} />
                ))}

              {totalPages > 1 && (
                <Pagination className="mt-8 justify-start">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }).map((_, x) => (
                      <PaginationItem
                        key={`page-${x}`}
                        onClick={() => setCurrentPage(x + 1)}
                      >
                        <PaginationLink
                          href="#"
                          isActive={x + 1 === currentPage}
                        >
                          {x + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        disabled={currentPage === totalDatasets}
                        onClick={() => setCurrentPage(currentPage + 1)}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </section>
      </div>
      <div className="order-2 hidden space-y-2.5 border-b-[1px] pt-3 sm:order-3  sm:min-w-[340px] sm:border-b-0 sm:border-l-[1px] sm:pl-3 lg:block">
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
};

export const usersMock = [
  {
    icon: "https://s3-alpha-sig.figma.com/img/9afa/40e6/7f9adfb6486c67063d80474f4d89a506?Expires=1726444800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=NEi3xXQhPKkFkLrImrAMoXZdLYuHPxcIEVM~uy4L1ysR-peh3aZL~CHzB5XIoq1eBqsJEgZaU-1sYXP1i99uFBwWQGtCPOvVzMr~Ynh8H3D-nMrTRBuRS7Bz8CQ5015Ql7YZZuMnXiluKM~Gi532dtgKfeZCmNLciv69G2O8xnL1u2C8tUJRJNbHLjdlntMIgBAj4JJKZr3UioutWGZ9sBCtzlR-FQkG4SnxMeOXUJfd7A~Dsvgk0QZNuqZItHfuBFDTKo1v99mKPPlADkvpwXt2bvulHiSTHipxahhF0TWHe9kgC8GKNDEwtgisipRjr1C5p2u59y0jdtW0vV3iDw__",
    name: "Jese Leos",
  },
  {
    icon: "https://s3-alpha-sig.figma.com/img/07f2/4b43/13a3636719731254b20a53f142074129?Expires=1726444800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=TE5jDENP4U8EAEIESaaubv~q3zRxeqLDrVDHOjqKzdVVmdqGJAPEgGuw1ZfobH7iyf52ZLcCCrWT~67~k2Yc2PqT1mFj9gWxFHBvEn2-QBXa0KypJ4IavzPIreRs8CPo5780-CbllE5vb5X-k7ndLMYA0AytYDUULEReF4uRPXx5kQxCF-O85wQ31nMs4tdEgphXBAdtf08QNmEokXcSt0nakX5c3xqR2t~vtkEAJbZh8jHaRp7y20P7IM-HILQZvcQpoM6JJUIwSNNA~yPnSaecSQrXIiaQMFw6jqVdlbW7GPp74uGounxm53UYafXcBamTtUr5UTOEix4wHINZog__",

    name: "Bonnie Green",
  },
  {
    icon: "https://s3-alpha-sig.figma.com/img/0fd7/5a97/c4192415d6c6bfda98f5332561767c52?Expires=1726444800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=WxgHyHmqC3nZLGqRG-bC7kfj~Qr~Eb95tGLkvYd2DSD4CqiSRG7sk8MNv0LY-9-JS6a-Y9To8e-WYL5lwATZReIZZaKat-6NrGBfaBfIPle3CZmOgDkdDWyQI1oqrW-FZ5ErVdGl9ZQbHMR9SYDKojx2SUQyDSSrZFBaRROb4XhBcGMZP-dSXaZSMhxrYKuorwsU14imu1s9Mkv749aiCNLHLWq8nN684W-nx365PJf4nPIke9ccbAZjq~ACodzmzMo5NhlL2qjE56yo8uM7kRer--wzWyYepv~W7DCFFAxEMDZhdn2LCeeO-XIX-UJGBwVKaUMLQyROI~HCTZLI0A__",
    name: "Michael Gough",
  },
  {
    icon: "https://s3-alpha-sig.figma.com/img/a756/1ca3/84cac555f78cac29f997f8adf8d31e17?Expires=1726444800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=I-Ruzxy-~Lj4lMeve22jKNbZGxnpKVKnAbuoSdly4HuLbVv72rD5F4ErIlpCZFoKd4IaNj5ybw8qplKoJF24A6ROQxta-OlMxIdgQCQ0PX9oNgKcftOmIPSaT9t3GqxTF7NuY7B82xrKcFM6FfUpRr93TpREMnsrhIRz17vg6-L8a2Zp4CJDC7LuAswpmTvBbSze-q2AzPQDYJoF44iXAncy~6oSwCq8lZGb2E24hTFKVd2rZ4Fenrujob9ZKVEYJTJUGuNRyixAXgfbAdKfzYvdtZ8Fz-7SuftnlFcVCsn8l5mCexGZrcS8EJ-Jhz5hxRHCxoz-vQvAY6xKmU86uw__",
    name: "Helene Engels",
  },
];
