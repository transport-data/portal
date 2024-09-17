import { useState, useMemo } from "react";
import DashboardTopicCard, {
  DashboardTopicCardProps } from "@components/_shared/DashboardTopicCard";
import SimpleSearchInput from "@components/ui/simple-search-input";
import { Button } from "@components/ui/button";
import { api } from "@utils/api";
import MiniSearch from "minisearch";
import Link from "next/link";
import { Plus } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export default () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const itemsPerPage = 10;
  const { data: groupsData } = api.group.list.useQuery();

  const miniSearch = useMemo(() => {
    const search = new MiniSearch({
      fields: ["description", "display_name", "name"], // fields to index for full-text search
      storeFields: ["id", "name"]
    });
    search.addAll(groupsData || []);
    return search;
  }, [groupsData]);

  const searchResults = useMemo(() => {
    if (!searchText) {
      return groupsData || [];
    }
    return miniSearch.search(searchText, { prefix: true }).map(result => {
      // Map MiniSearch result to the format expected by DashboardTopicCard
      const group = groupsData?.find(g => g.id === result.id);
      // Ensure all required fields are present
      return group || {} as DashboardTopicCardProps;
    });
  }, [searchText, groupsData, miniSearch]);

  const paginatedData = useMemo(() => {
    if(searchText) {
      setCurrentPage(1);
    }
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return searchResults.slice(startIndex, endIndex);
  }, [searchResults, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(searchResults.length / itemsPerPage);

  return (
    <div>
      <div className="grid grid-cols-12 gap-2 xl:max-h-[36px]">
        <div className="col-span-8">
          <SimpleSearchInput
            onTextInput={(text) => setSearchText(text)}
            placeholder="Search"
          />
        </div>
        <div className="col-span-2">
          <Link href="/dashboard/topics/create">
            <Button className="gap-2 px-3 py-2">
                <Plus size={16}/>
              New Topic
            </Button>
          </Link>
        </div>
      </div>
      <div className="mt-2 grid grid-cols-12 gap-2 sm:flex-row sm:gap-8">
        <div className="col-span-9">
          <section className="flex flex-col gap-4">
            {paginatedData.length > 0 ? (
              paginatedData.map((group) => (
                <div key={group?.id}>
                  <DashboardTopicCard {...group} />
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-[80px]">
                <p className="text-center">No Topics found</p>
              </div>
            )}
          </section>
        </div>
      </div>
      <Pagination className="mt-2">
        <PaginationContent>
          <PaginationPrevious
            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
            disabled={currentPage===1}
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
            onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage==totalPages}
          />
        </PaginationContent>
      </Pagination>
    </div>
    
  );
};
