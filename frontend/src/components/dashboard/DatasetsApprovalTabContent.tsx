import DashboardDatasetCard, {
  DatasetsCardsLoading,
} from "@components/_shared/DashboardDatasetCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@components/ui/pagination";
import { SelectableItemsList } from "@components/ui/selectable-items-list";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/20/solid";
import { Dataset } from "@interfaces/ckan/dataset.interface";
import { DocumentReportIcon } from "@lib/icons";
import { cn } from "@lib/utils";
import { SearchDatasetType } from "@schema/dataset.schema";
import { api } from "@utils/api";
import { CircleCheckIcon, CircleXIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default ({
  adminOrEditorUserOrgs,
}: {
  adminOrEditorUserOrgs: any[];
}) => {
  const { data: session } = useSession();
  const [filteredApprovalStatus, setApprovalStatus] = useState("*");
  const [currentPage, setCurrentPage] = useState(0);

  const datasetsPerPage = 9;

  const [searchFilter, setSearchFilter] = useState<SearchDatasetType>({
    offset: 0,
    limit: datasetsPerPage,
    sort: "score desc, metadata_modified desc",
    includeDrafts: true,
    includePrivate: true,
    orgs: adminOrEditorUserOrgs.map((x) => x.name),
    contributors: session?.user.sysadmin ? undefined : [session?.user.id || ""],
    advancedQueries: [
      { key: "approval_status", values: ["pending", "rejected"] },
    ],
  });

  const {
    isLoading,
    data: { datasets, count } = {
      datasets: [],
      facets: {} as any,
    },
  } = api.dataset.search.useQuery({
    ...searchFilter,
  });

  api.dataset.search.useQuery({
    ...searchFilter,
    offset: (currentPage + 1) * 9,
  });

  const datasetCount = count;

  const pages = new Array(
    Math.ceil((datasetCount || 0) / datasetsPerPage)
  ).fill(0);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:gap-36">
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
              icon: <CircleXIcon width={16} height={16} />,
              isSelected: false,
              text: "Rejected",
              value: "rejected",
            },
            {
              icon: <QuestionMarkCircleIcon width={16} />,
              isSelected: false,
              text: "Pending",
              value: "pending",
            },
          ]}
          onSelectedItem={(selected) => {
            setSearchFilter((oldSearch) => ({
              ...oldSearch,
              advancedQueries: [
                {
                  key: "approval_status",
                  values:
                    selected === "*"
                      ? ["pending", "rejected"]
                      : [selected],
                },
              ],
              offset: 0,
            }));
            setCurrentPage(0);
            setApprovalStatus(selected);
          }}
          selected={filteredApprovalStatus}
          title="Status"
        />
      </div>
      <div className="order-3 w-full sm:order-2 md:max-w-[556px] xl:max-w-[700px]">
        <h3 className="mb-4 text-sm font-semibold">Status</h3>
        <section className="flex flex-col gap-4">
          {isLoading ? (
            <DatasetsCardsLoading />
          ) : (
            <>
              {datasets?.length > 0 ? (
                datasets?.map((x) => {
                  const org = adminOrEditorUserOrgs?.find(
                    (org) => org.name === x.organization?.name
                  );
                  const role = org?.capacity;
                  const canEdit = role === "admin" || role === "editor";
                  return (
                    <DashboardDatasetCard
                      removeIcon
                      datasetRequest
                      key={x.id}
                      {...(x as Dataset)}
                      canEdit={canEdit}
                    />
                  );
                })
              ) : (
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
    </div>
  );
};
