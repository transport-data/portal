import { useState, useEffect } from "react";
import DashboardTopicCard, {
    DashboardTopicCardProps
} from "@components/_shared/DashboardTopicCard";
import SimpleSearchInput from "@components/ui/simple-search-input";
import { api } from "@utils/api";

export default () => {
  const { data: groupsData } = api.group.list.useQuery();
  const [searchText, setSearchText] = useState("");
  const [filteredGroups, setFilteredGroups] = useState<DashboardTopicCardProps[]>([]);

  // Filter groups based on search text
  useEffect(() => {
    if (groupsData) {
      setFilteredGroups(
        groupsData.filter((group) =>
          group.name.toLowerCase().includes(searchText.toLowerCase()) ||
          group.title.toLowerCase().includes(searchText.toLowerCase()) ||
          group.display_name.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }
  }, [searchText, groupsData]);

  return (
    <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:gap-8">
      <div className="order-1 space-y-12">
        <div className="lg:hidden">
            <SimpleSearchInput
                onTextInput={(text) => setSearchText(text)}
                placeholder="Search"
            />
        </div>
      </div>
      <div className="order-3 w-fit">
        <section className="flex flex-col gap-4">
            {filteredGroups && filteredGroups.length > 0 ? (
                <div>
                    {filteredGroups.map((x) => (
                        <DashboardTopicCard {...x} />
                    ))}
                </div>
            ):(
                <p>No Topics found</p>
            )}   
        </section>
      </div>
      <div className="order-2 hidden space-y-2.5 border-b-[1px] pt-3 sm:order-3 sm:w-[340px] sm:max-w-[340px] sm:border-b-0 sm:border-l-[1px] sm:pl-3 lg:block">
        <SimpleSearchInput
          onTextInput={(text) => setSearchText(text)}
          placeholder="Search"
        />
      </div>
    </div>
  );
};
