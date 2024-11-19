import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import DashboardOrganizationCard from "@components/_shared/DashboardOrganizationCard";
import { Button } from "@components/ui/button";
import SimpleSearchInput from "@components/ui/simple-search-input";
import { UserOrganization } from "@utils/organization";
import { Plus } from "lucide-react";
import MiniSearch from "minisearch";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useMemo, useState } from "react";

export default ({
  userOrganizations,
}: {
  userOrganizations: UserOrganization[];
}) => {
  const { data: sessionData } = useSession();
  const isSysAdmin = sessionData?.user?.sysadmin == true;

  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const miniSearch = useMemo(() => {
    const search = new MiniSearch({
      fields: ["description", "display_name", "name"], // fields to index for full-text search
      storeFields: ["id", "name"],
    });
    search.addAll(userOrganizations || []);
    return search;
  }, [userOrganizations]);

  const searchResults = useMemo(() => {
    const filtered_orgs = userOrganizations || [];
    if (!searchText) {
      return filtered_orgs;
    }
    return miniSearch.search(searchText, { prefix: true }).map((result) => {
      const group = filtered_orgs?.find((g) => g.id === result.id);
      // Ensure all required fields are present
      return group || ({} as any);
    });
  }, [searchText, userOrganizations, miniSearch]);

  const paginatedData = useMemo(() => {
    if (searchText) {
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
        <div className="col-span-10">
          <SimpleSearchInput
            onTextInput={(text) => setSearchText(text)}
            placeholder="Search"
          />
        </div>
        {isSysAdmin && (
          <div className="col-span-2">
            <Link href="/dashboard/organizations/create">
              <Button className="gap-2 px-3 py-2 text-sm sm:text-base">
                <Plus size={16} />
                Add New
              </Button>
            </Link>
          </div>
        )}
      </div>
      <div className="mt-2 grid grid-cols-12 gap-2 sm:flex-row sm:gap-8">
        <div className="col-span-10">
          <section className="flex flex-col gap-4">
            {paginatedData.length > 0 ? (
              paginatedData.map((org) => (
                <div key={org?.id}>
                  <DashboardOrganizationCard
                    {...org}
                    isReadOnly={org.capacity !== "admin"}
                  />
                </div>
              ))
            ) : (
              <div className="flex h-[80px] items-center justify-center">
                <p className="text-center">No Organisations found</p>
              </div>
            )}
          </section>
        </div>
      </div>
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
  );
};
