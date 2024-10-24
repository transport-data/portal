import Guidelines from "@components/_shared/Guidelines";
import NewsFeedSearchFilters from "@components/search/NewsfeedSearchFilters";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@components/ui/pagination";
import { SelectableItemsList } from "@components/ui/selectable-items-list";
import { DocumentReportIcon } from "@lib/icons";
import { Activity } from "@portaljs/ckan";
import { api } from "@utils/api";
import { format } from "date-fns";
import { Building, CircleCheck, Database } from "lucide-react";
import MiniSearch from "minisearch";
import { useEffect, useMemo, useState } from "react";
import DashboardNewsFeedCard, {
  DashboardNewsfeedCardProps,
} from "./DashboardNewsFeedCard";

const groupByDate = (activities: Activity[]) => {
  return activities.reduce((groups: any, activity: Activity) => {
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
  const actionsFilterOptions = [
    "All",
    "created",
    "deleted",
    "updated",
    "rejected",
    "approved",
    "requested",
  ];
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [actionsFilter, setActionsFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, actionsFilter, searchText]);

  const { data: searchResults, isLoading } =
    api.user.listDashboardActivities.useQuery();

  const groupedActivities = useMemo(() => {
    return groupByDate(searchResults || []);
  }, [searchResults]);

  const totalPages = Math.ceil((searchResults?.count || 0) / itemsPerPage);

  return (
    <div>
      <NewsFeedSearchFilters
        setSearchText={setSearchText}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        actionsFilter={actionsFilter}
        setActionsFilter={setActionsFilter}
        actionsFilterOptions={actionsFilterOptions}
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
            onSelectedItem={(option) => setCategoryFilter(option)}
            selected={categoryFilter}
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
              <div>Loading</div>
            ) : paginatedData?.length || 0 > 0 ? (
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
              <div>No News Found</div>
            )}
          </section>
          <Pagination className="mt-2">
            <PaginationContent>
              <PaginationPrevious
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
              />
              {Array.from({ length: totalPages }, (_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    isActive={index + 1 === currentPage}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationNext
                onClick={() =>
                  setCurrentPage(Math.min(currentPage + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              />
            </PaginationContent>
          </Pagination>
        </div>
        <div className="hidden lg:block">
          <Guidelines />
        </div>
      </div>
    </div>
  );
};
