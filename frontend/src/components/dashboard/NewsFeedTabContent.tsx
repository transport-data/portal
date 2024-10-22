import Guidelines from "@components/_shared/Guidelines";
import NewsFeedSearchFilters from "@components/search/NewsfeedSearchFilters";
import { SelectableItemsList } from "@components/ui/selectable-items-list";
import { api } from "@utils/api";
import { useState, useMemo, useEffect } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@components/ui/pagination";
import MiniSearch from "minisearch";
import { Building, CircleCheck, Database } from "lucide-react";
import { DocumentReportIcon } from "@lib/icons";
import DashboardNewsFeedCard from "./DashboardNewsFeedCard";
import { format } from "date-fns";
import { DashboardNewsfeedCardProps } from "./DashboardNewsFeedCard";
import { Activity } from "@portaljs/ckan";

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
  const actionsFilterOptions = ["All", "created", "deleted", "updated"];
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [actionsFilter, setActionsFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, actionsFilter, searchText]);

  const { data: activities, isLoading } =
    api.user.listDashboardActivities.useQuery();

  const preprocessedActivities = activities?.map((activity: any) => {
    return {
      ...activity,
      "data.group.title": activity.data?.group?.title || "",
      "data.group.name": activity.data?.group?.name || "",
      "data.package.name": activity.data?.package?.name || "",
      "data.package.title": activity.data?.package?.title || "",
      "data.actor": activity.data?.actor || "",
    };
  });

  const miniSearch = useMemo(() => {
    const search = new MiniSearch({
      fields: [
        "data.group.title",
        "data.group.name",
        "data.package.name",
        "data.package.title",
        "data.actor",
      ],
      storeFields: ["id", "timestamp", "user_id", "activity_type", "data"],
    });
    search.addAll(preprocessedActivities || []);
    return search;
  }, [preprocessedActivities]);

  const searchResults = useMemo(() => {
    const filteredActivites =
      categoryFilter === "All"
        ? activities
        : activities?.filter((item) =>
            categoryFilter === "Organizations"
              ? item.activity_type?.includes("organization")
              : categoryFilter === "Datasets"
              ? item.activity_type?.includes("package")
              : categoryFilter === "Datasets approvals"
              ? item.activity_type?.includes("reviewed") // TODO change this to the correct text
              : true
          );
    const actionFilteredActivities =
      actionsFilter === "All"
        ? filteredActivites
        : filteredActivites?.filter((item) =>
            actionsFilter === "deleted"
              ? item.activity_type?.includes("deleted")
              : actionsFilter === "updated"
              ? item.activity_type?.includes("changed")
              : actionsFilter === "created"
              ? item.activity_type?.includes("new")
              : true
          );
    if (!searchText) {
      return actionFilteredActivities;
    }

    return miniSearch.search(searchText, { prefix: true }).map((result) => {
      const searchedActivities = filteredActivites?.find(
        (g) => g.id === result.id
      );
      return searchedActivities as NewsFeedCardProps;
    });
  }, [searchText, activities, miniSearch, categoryFilter, actionsFilter]);

  const sortedResults = useMemo(() => {
    if (sortOrder === "latest") {
      return searchResults
        ?.slice()
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
    } else {
      return searchResults
        ?.slice()
        .sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
    }
  }, [searchResults, sortOrder]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedResults?.slice(startIndex, endIndex);
  }, [sortedResults, currentPage, itemsPerPage]);

  const groupedActivities = useMemo(() => {
    return groupByDate(paginatedData || []);
  }, [paginatedData]);

  const totalPages = Math.ceil((searchResults?.length || 0) / itemsPerPage);

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
