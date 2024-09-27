import DashboardDatasetCard from "@components/_shared/DashboardDatasetCard";
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

export default () => {
  const { data: session } = useSession();
  const [visibility, setVisibility] = useState("All");

  const options: SearchDatasetType = {
    offset: 0,
    limit: 20,
    private: true,
    includeDrafts: true,
    advancedQueries: [{ key: "creator_user_id", values: [session!.user.id] }],
  };

  const { data, isLoading } = api.dataset.search.useQuery(options);

  const datasets = data?.datasets;

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
            Array.from({ length: 3 }).map((_, x) => (
              <div key={x} className="flex w-full cursor-pointer gap-6">
                <div className="flex h-8 w-8 flex-col items-center gap-32 lg:flex-row lg:gap-8">
                  <Skeleton className="h-8 w-8 bg-gray-200" />
                </div>
                <Skeleton className="h-[60px] w-full bg-gray-200" />
              </div>
            ))
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
