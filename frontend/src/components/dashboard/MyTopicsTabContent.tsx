import { useState } from "react";
import DashboardTopicCard from "@components/_shared/DashboardTopicCard";
import SimpleSearchInput from "@components/ui/simple-search-input";
import { Button } from "@components/ui/button";
import { api } from "@utils/api";
import MiniSearch from "minisearch";
import Link from "next/link";
import { Plus } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";


export default () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchText, setSearchText] = useState("");
  const { data: groupsData } = api.group.list.useQuery();
  const miniSearch = new MiniSearch({
    fields: ["description", "display_name", "name"], // fields to index for full-text search
    storeFields: ["description", "display_name", "image_display_url", "name"], // fields to return with search results
  });
  miniSearch.addAll(groupsData || []);

  const paginatedData = groupsData?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) || [];
  const totalPages = Math.ceil((groupsData?.length || 0) / itemsPerPage);
    
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
              {paginatedData && paginatedData.length > 0 ? (
                paginatedData.map((group) => (
                  <div key={group.id} className={
                    searchText !== "" &&
                    !miniSearch
                      .search(searchText, { prefix: true })
                      .find((result) => result.id === group.id)
                      ? "hidden"
                      : "block"}>
                    <DashboardTopicCard {...group} />
                  </div>
                ))     
              ):(
                  <p>No Topics found</p>
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
