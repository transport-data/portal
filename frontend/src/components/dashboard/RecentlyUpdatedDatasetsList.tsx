import { useRef } from "react";
import DatasetCard from "./DatasetCard";
import type { SearchDatasetType } from "@schema/dataset.schema";
import { api } from "@utils/api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

export default function RecentlyUpdatedDatasetsList({
  publicUrl,
}: {
  publicUrl: string;
}) {
  const datasetsQuery = useRef<SearchDatasetType>({
    query: "",
    offset: 0,
    limit: 5,
    sort: "metadata_modified desc",
    groups: [],
    orgs: [],
    tags: [],
    include_private: true,
  });

  const { data } = api.dataset.search.useQuery(
    datasetsQuery.current as unknown as SearchDatasetType
  );

  const datasets = data?.results;

  return (
    <div className="my-10">
      <h2 className="mb-5 text-base font-semibold leading-6">
        Recently updated
      </h2>
      <Swiper
        breakpoints={{
          0: { slidesPerView: 1 },
          764: { slidesPerView: 2 },
          1440: { slidesPerView: 3 },
        }}
        spaceBetween={20}
        modules={[Pagination]}
        pagination={{
          clickable: true,
          el: "#pagination-bullets",
          renderBullet: (index: number, className: string) => {
            return '<span class="' + className + '">' + "</span>";
          },
        }}
      >
        {datasets?.map((dataset) => (
          <SwiperSlide key={dataset.id}>
            <DatasetCard dataset={dataset} publicUrl={publicUrl} />
          </SwiperSlide>
        ))}
      </Swiper>
      <div id="pagination-bullets" className="text-center"></div>
    </div>
  );
}
