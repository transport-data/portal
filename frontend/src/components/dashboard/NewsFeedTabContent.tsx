import Guidelines from "@components/_shared/Guidelines";
import SimpleSearchInput from "@components/ui/simple-search-input";
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
import { Building, Database, CircleCheck } from "lucide-react";
import { DocumentReportIcon } from "@lib/icons";
import DashboardNewsFeedCard from "./DashboardNewsFeedCard";
import { format } from "date-fns";
import { DashboardNewsfeedCardProps } from "./DashboardNewsFeedCard";

const groupByDate = (activities: any) => {
  return activities.reduce((groups: any, activity: any) => {
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
  const filterOptions = [
    "All",
    "Organizations",
    "Datasets",
    "Datasets Approvals",
  ];
  const [searchText, setSearchText] = useState("");
  const [filter, setFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchText]);

  const { data: activities, isLoading } =
    api.user.listUserActivities.useQuery();

  const preprocessedActivities = activities?.map((activity: any) => {
    const activitySegments = activity.activity_type?.split(" ");
    const activityType = activitySegments ? activitySegments[0] : "changed";
    const activityTarget = activitySegments
      ? activitySegments[1] === "package"
        ? "dataset"
        : activitySegments[1]
      : "entity";

    // Add synonyms for activity type and target
    const mappedActivityType =
      activityType === "changed" ? "updated" : activityType;
    const mappedActivityTarget =
      activityTarget === "dataset" ? "package" : activityTarget;

    return {
      ...activity,
      "data.group.title": activity.data?.group?.title || "",
      "data.group.name": activity.data?.group?.name || "",
      "data.package.name": activity.data?.package?.name || "",
      "data.package.title": activity.data?.package?.title || "",
      "data.actor": activity.data?.actor || "",
      activity_type_synonym: `${activityType} ${activityTarget} ${mappedActivityType} ${mappedActivityTarget}`,
    };
  });

  const miniSearch = useMemo(() => {
    const search = new MiniSearch({
      fields: [
        "activity_type_synonym",
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
    const filteredActivites = activities?.filter((item) =>
      filter === "Organizations"
        ? item.activity_type?.includes("organization")
        : filter === "Datasets" || filter === "Datasets Approvals"
        ? item.activity_type?.includes("package")
        : true
    );
    if (!searchText) {
      return filteredActivites;
    }

    return miniSearch.search(searchText, { prefix: true }).map((result) => {
      const searchedActivities = filteredActivites?.find(
        (g) => g.id === result.id
      );
      return searchedActivities as NewsFeedCardProps;
    });
  }, [searchText, activities, miniSearch, filter]);

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
      <div className="grid grid-cols-12 gap-2 xl:max-h-[36px] ">
        <div className="col-span-12 xl:col-span-6">
          <SimpleSearchInput onTextInput={(x) => setSearchText(x)} />
        </div>
        <div className="col-span-12 xl:col-span-2">
          <div
            className="flex  
            h-[36px]
            items-center
            rounded-lg
            rounded-e-lg
            border
            border-s
            border-gray-300 border-l-gray-300
            border-s-gray-100 bg-white
          text-black shadow-sm
           focus-within:ring-[1px] focus-within:ring-[#111928]"
          >
            <span className="z-10 inline-flex flex-shrink-0 items-end rounded-xl  pl-3 text-center text-sm font-medium text-[#6B7280] dark:bg-gray-700 dark:text-white ">
              Sort by:
            </span>
            <select
              id="states"
              className="remove-input-ring block w-full rounded-lg rounded-e-lg border-0 bg-white p-0 pl-[3px]
            text-sm text-gray-900 ring-0 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 "
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="latest" selected={sortOrder === "latest"}>
                Latest activity
              </option>
              <option value="oldest" selected={sortOrder === "oldest"}>
                Oldest activity
              </option>
            </select>
          </div>
        </div>
        <div className="col-span-12 xl:col-span-2">
          <select
            id="filter"
            name="filter"
            className="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-[#111928]"
            onChange={(e) => setFilter(e.target.value)}
          >
            {filterOptions &&
              filterOptions.map((item) => <option value={item}>{item}</option>)}
          </select>
        </div>
      </div>
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
                value: "Datasets Approvals",
              },
            ]}
            onSelectedItem={(option) => setFilter(option)}
            selected={filter}
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
