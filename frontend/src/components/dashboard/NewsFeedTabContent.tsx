import Guidelines from "@components/_shared/Guidelines";
import NewsFeedSearchFilters from "@components/search/NewsfeedSearchFilters";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@components/ui/pagination";
import { SelectableItemsList } from "@components/ui/selectable-items-list";
import { DocumentReportIcon } from "@lib/icons";
import { cn } from "@lib/utils";
import { Activity } from "@portaljs/ckan";
import {
  dashboardActivityAction,
  SearchNewsfeedActivityType,
} from "@schema/user.schema";
import { api } from "@utils/api";
import { format } from "date-fns";
import {
  Building,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Database,
} from "lucide-react";
import { useMemo, useState } from "react";
import DashboardNewsFeedCard, {
  DashboardNewsfeedCardProps,
} from "./DashboardNewsFeedCard";
import { Skeleton } from "@components/ui/skeleton";

export type SearchNewsfeedPageOnChange = (
  data: {
    value: string[] | boolean | string | number | undefined;
    key: keyof SearchNewsfeedActivityType;
  }[]
) => void;

const groupByDate = (
  activities: Activity[],
  sort: "latest" | "oldest" = "latest"
) => {
  const sortedActivities = activities.sort((a, b) => {
    if (sort === "latest") {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    } else {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    }
  });
  return sortedActivities.reduce((groups: any, activity: Activity) => {
    if (activity?.timestamp) {
      const formattedDate = format(
        new Date(activity?.timestamp),
        "MMMM do, yyyy"
      ); // Format like "January 13th, 2022"
      if (!groups[formattedDate]) {
        groups[formattedDate] = [];
      }
      groups[formattedDate].push(activity);
      return groups;
    }
    return {};
  }, {});
};

export interface NewsFeedCardProps {
  id: string;
  timestamp: string;
  user_id: string;
  activity_type: string;
}
export default () => {
  const limit = 9;
  const [currentPage, setCurrentPage] = useState(0);
  const [searchFilter, setSearchFilter] = useState<SearchNewsfeedActivityType>({
    limit,
  });

  const { data: { results: searchResults, count } = {}, isLoading } =
    api.user.listDashboardActivities.useQuery(searchFilter);

  api.user.listDashboardActivities.useQuery({
    ...searchFilter,
    offset: (currentPage + 1) * limit,
    limit,
  });

  const groupedActivities = useMemo(() => {
    return groupByDate(searchResults || [], searchFilter.sort);
  }, [searchResults]);

  const pages = new Array(Math.ceil((count || 0) / limit)).fill(0);

  const onChange: SearchNewsfeedPageOnChange = (data) => {
    setSearchFilter((oldValue) => {
      const updatedValue: any = { ...oldValue, offset: 0 };
      data.forEach((x) => (updatedValue[x.key] = x.value));
      return updatedValue;
    });
    setCurrentPage(0);
  };

  return (
    <div>
      <NewsFeedSearchFilters
        onChange={onChange}
        sortOrder={searchFilter.sort || "latest"}
        actionsFilter={searchFilter.action || "All"}
        actionsFilterOptions={dashboardActivityAction}
      />
      <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:gap-8">
        <div className="space-y-6">
          <SelectableItemsList
            items={[
              {
                icon: <DocumentReportIcon />,
                isSelected: true,
                value: "All",
              },
              {
                icon: <Building size={14} />,
                isSelected: false,
                value: "Organizations",
              },
              {
                icon: <Database size={14} />,
                isSelected: false,
                value: "Datasets",
              },
              {
                icon: <CircleCheck size={14} />,
                isSelected: false,
                value: "Datasets approvals",
              },
            ]}
            onSelectedItem={(option) =>
              onChange([
                {
                  key: "activityType",
                  value:
                    option === "Datasets approvals"
                      ? "approval"
                      : option === "Datasets"
                      ? "dataset"
                      : option === "Organizations"
                      ? "organization"
                      : "",
                },
              ])
            }
            selected={
              searchFilter.activityType === "approval"
                ? "Datasets approvals"
                : searchFilter.activityType === "dataset"
                ? "Datasets"
                : searchFilter.activityType === "organization"
                ? "Organizations"
                : "All"
            }
            title="Categories"
          />
          <div className="lg:hidden">
            <Guidelines />
          </div>
        </div>
        <div className="mx-auto w-full">
          <h3 className="mb-4 text-sm font-semibold">Timeline</h3>
          <section className="flex flex-col gap-4">
            {isLoading ? (
              <>
                {[...Array(2)].map((_, index) => (
                  <Skeleton
                    className="flex h-[100px] w-full items-center gap-3 rounded border bg-white px-4 "
                    key={index}
                  >
                    <Skeleton className="h-[48px] w-[48px] rounded-full" />
                    <div className="block w-full md:w-[70%]">
                      <Skeleton className="block h-[24px] w-full" />
                    </div>
                  </Skeleton>
                ))}
              </>
            ) : Object.values(groupedActivities).flat().length ? (
              Object.entries(groupedActivities).map(([date, activities]) => (
                <div className="rounded border bg-white px-4 pt-4" key={date}>
                  <h4 className="mb-5 font-semibold">{date}</h4>{" "}
                  {(activities as DashboardNewsfeedCardProps[])?.map(
                    (activity) => (
                      <DashboardNewsFeedCard {...activity} key={activity.id} />
                    )
                  )}
                </div>
              ))
            ) : (
              <div className="text-sm">No news found...</div>
            )}
          </section>
          {pages.length ? (
            <Pagination className="mx-0 mt-8 justify-start">
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
                        offset: (currentPage - 1) * limit,
                      }));
                      setCurrentPage((oldV) => oldV - 1);
                    }}
                  >
                    <ChevronLeft className="h-4 w-4" />
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
                            offset: i * limit,
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
                        offset: (currentPage + 1) * limit,
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
          ) : (
            <></>
          )}
        </div>
        <div className="hidden lg:block">
          <Guidelines />
        </div>
      </div>
    </div>
  );
};
