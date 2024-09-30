import DashboardDatasetCard, {
  DatasetsCardsLoading,
} from "@components/_shared/DashboardDatasetCard";
import DatasetsFilter from "@components/_shared/DatasetsFilter";
import { SelectableItemsList } from "@components/ui/selectable-items-list";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { Dataset } from "@interfaces/ckan/dataset.interface";
import { useState } from "react";
import { SearchDatasetType } from "@schema/dataset.schema";
import { searchDatasets } from "@utils/dataset";
import { DocumentReportIcon, EyeOffIcon, GlobeAltIcon } from "@lib/icons";
import { api } from "@utils/api";
import { Skeleton } from "@components/ui/skeleton";
import DatasetsFilterMocked from "@components/_shared/DatasetsFilterMocked";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@components/ui/pagination";

export default () => {
  const { data: session } = useSession();
  const [visibility, setVisibility] = useState("All");
  const [page, setPage] = useState(1);
  const datasetsPerPage = 20;
  const offset = (page - 1) * datasetsPerPage;

  const options: SearchDatasetType = {
    offset: offset,
    limit: datasetsPerPage,
    includePrivate: true,
    includeDrafts: true,
    query: `creator_user_id:${session?.user.id}`,
  };

  const { data, isLoading } = api.dataset.search.useQuery(options);

  const datasets = data?.datasets;

  const totalDatasets = data?.count ?? 0;

  const totalPages = Math.ceil(totalDatasets / datasetsPerPage);

  return (
    <div className=" flex flex-col justify-between gap-4 sm:flex-row sm:gap-8">
      <div className="order-1 space-y-12 lg:min-w-[120px]">
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
                  <DashboardDatasetCard {...x} />
                ))}

              {totalPages > 1 && (
                <Pagination className="mt-8 justify-start">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }).map((_, x) => (
                      <PaginationItem
                        key={`page-${x}`}
                        onClick={() => setPage(x + 1)}
                      >
                        <PaginationLink href="#" isActive={x + 1 === page}>
                          {x + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        disabled={page === totalDatasets}
                        onClick={() => setPage(page + 1)}
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
        <DatasetsFilterMocked />
      </div>
    </div>
  );
};
