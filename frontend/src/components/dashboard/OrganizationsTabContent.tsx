import { useState } from "react";
import DashboardOrganizationCard from "@components/_shared/DashboardOrganizationCard";
import { api } from "@utils/api";
import SimpleSearchInput from "@components/ui/simple-search-input";
import { Button } from "@components/ui/button";
import MiniSearch from "minisearch";
import Link from "next/link";
import { Plus } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export default () => {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { data: organizations } = api.organization.listForUser.useQuery();
  const miniSearch = new MiniSearch({
    fields: ["description", "display_name", "name"], // fields to index for full-text search
    storeFields: ["description", "display_name", "image_display_url", "name"], // fields to return with search results
  });
  miniSearch.addAll(organizations || []);
  const paginatedData = organizations?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) || [];
  const totalPages = Math.ceil((organizations?.length || 0) / itemsPerPage);
  
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
          <Link href="/dashboard/organizations/create">
            <Button className="gap-2 px-3 py-2">
              <Plus size={16}/>
              New Organization
            </Button>
          </Link>
        </div>
      </div>
      <div className="mt-2 grid grid-cols-12 gap-2 sm:flex-row sm:gap-8">
        <div className="col-span-9">
          <section className="flex flex-col gap-4">
          {paginatedData && paginatedData.length > 0 ? (
            paginatedData.map((org) => (
              <div key={org.id} className={
                searchText !== "" &&
                !miniSearch
                  .search(searchText, { prefix: true })
                  .find((result) => result.id === org.id)
                  ? "hidden"
                  : "block"}>
                <DashboardOrganizationCard {...org} />
                </div>
              ))
          ):(
              <p>No Organizations found</p>
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
            onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
          />
        </PaginationContent>
      </Pagination>
    </div>
    
  );
};

export const usersMock = [
  {
    icon: "https://s3-alpha-sig.figma.com/img/9afa/40e6/7f9adfb6486c67063d80474f4d89a506?Expires=1726444800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=NEi3xXQhPKkFkLrImrAMoXZdLYuHPxcIEVM~uy4L1ysR-peh3aZL~CHzB5XIoq1eBqsJEgZaU-1sYXP1i99uFBwWQGtCPOvVzMr~Ynh8H3D-nMrTRBuRS7Bz8CQ5015Ql7YZZuMnXiluKM~Gi532dtgKfeZCmNLciv69G2O8xnL1u2C8tUJRJNbHLjdlntMIgBAj4JJKZr3UioutWGZ9sBCtzlR-FQkG4SnxMeOXUJfd7A~Dsvgk0QZNuqZItHfuBFDTKo1v99mKPPlADkvpwXt2bvulHiSTHipxahhF0TWHe9kgC8GKNDEwtgisipRjr1C5p2u59y0jdtW0vV3iDw__",
    name: "Jese Leos",
  },
  {
    icon: "https://s3-alpha-sig.figma.com/img/07f2/4b43/13a3636719731254b20a53f142074129?Expires=1726444800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=TE5jDENP4U8EAEIESaaubv~q3zRxeqLDrVDHOjqKzdVVmdqGJAPEgGuw1ZfobH7iyf52ZLcCCrWT~67~k2Yc2PqT1mFj9gWxFHBvEn2-QBXa0KypJ4IavzPIreRs8CPo5780-CbllE5vb5X-k7ndLMYA0AytYDUULEReF4uRPXx5kQxCF-O85wQ31nMs4tdEgphXBAdtf08QNmEokXcSt0nakX5c3xqR2t~vtkEAJbZh8jHaRp7y20P7IM-HILQZvcQpoM6JJUIwSNNA~yPnSaecSQrXIiaQMFw6jqVdlbW7GPp74uGounxm53UYafXcBamTtUr5UTOEix4wHINZog__",

    name: "Bonnie Green",
  },
  {
    icon: "https://s3-alpha-sig.figma.com/img/0fd7/5a97/c4192415d6c6bfda98f5332561767c52?Expires=1726444800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=WxgHyHmqC3nZLGqRG-bC7kfj~Qr~Eb95tGLkvYd2DSD4CqiSRG7sk8MNv0LY-9-JS6a-Y9To8e-WYL5lwATZReIZZaKat-6NrGBfaBfIPle3CZmOgDkdDWyQI1oqrW-FZ5ErVdGl9ZQbHMR9SYDKojx2SUQyDSSrZFBaRROb4XhBcGMZP-dSXaZSMhxrYKuorwsU14imu1s9Mkv749aiCNLHLWq8nN684W-nx365PJf4nPIke9ccbAZjq~ACodzmzMo5NhlL2qjE56yo8uM7kRer--wzWyYepv~W7DCFFAxEMDZhdn2LCeeO-XIX-UJGBwVKaUMLQyROI~HCTZLI0A__",
    name: "Michael Gough",
  },
  {
    icon: "https://s3-alpha-sig.figma.com/img/a756/1ca3/84cac555f78cac29f997f8adf8d31e17?Expires=1726444800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=I-Ruzxy-~Lj4lMeve22jKNbZGxnpKVKnAbuoSdly4HuLbVv72rD5F4ErIlpCZFoKd4IaNj5ybw8qplKoJF24A6ROQxta-OlMxIdgQCQ0PX9oNgKcftOmIPSaT9t3GqxTF7NuY7B82xrKcFM6FfUpRr93TpREMnsrhIRz17vg6-L8a2Zp4CJDC7LuAswpmTvBbSze-q2AzPQDYJoF44iXAncy~6oSwCq8lZGb2E24hTFKVd2rZ4Fenrujob9ZKVEYJTJUGuNRyixAXgfbAdKfzYvdtZ8Fz-7SuftnlFcVCsn8l5mCexGZrcS8EJ-Jhz5hxRHCxoz-vQvAY6xKmU86uw__",
    name: "Helene Engels",
  },
];
