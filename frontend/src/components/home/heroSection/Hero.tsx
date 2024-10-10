import { ChevronRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import SearchBar from "@components/search/SearchBar";
import Video from "./Video";
import InfoCards from "./InfoCards";
import PartnersCarousel from "@components/_shared/PartnersCarousel";

export type HeroAsset = {
  path: string;
  type: "mp4" | "image" | "youtube";
};

export default function Hero({ asset }: { asset: HeroAsset }) {
  return (
    <section className="pb-[96px] pt-[64px]">
      <div className="container flex flex-col gap-[72px]">
        <div className="flex items-center gap-x-16 xl:items-start">
          <div className="w-full">
            <Link
              href="/data-provider"
              className="flex w-fit items-center rounded-[14px] bg-[#F3F4F6] p-1.5"
            >
              <span className="block min-w-fit rounded-[10px] bg-accent px-[12px] py-[2px] text-[12px] font-medium leading-[18px] text-white">
                Add data
              </span>
              <span className="ml-8 block text-sm font-medium text-gray-500">
                Learn how to contribute to the TDC
              </span>
              <ChevronRightIcon className="ml-4 text-gray-500" width={20} />
            </Link>

            <h2 className=" mb-[24px] mt-[20px] text-[40px] font-extrabold leading-none text-gray-900 sm:text-[40px] lg:text-[60px]">
              Making high quality transport data accessible
            </h2>
            <p className="text-[20px] leading-[30px] text-gray-500">
              Transport Data Commons aims to improve access, sharing, and
              analysing transportation data for a more sustainable future.
            </p>
            <div className="mt-8 lg:max-w-[576px]">
              <SearchBar />
            </div>
          </div>
          <div className="m-auto hidden min-w-[420px] lg:block xl:min-w-[540px]">
            {asset.type === "mp4" && <Video path={asset.type} />}
            {asset.type === "youtube" && (
              <iframe
                className="h-[405px] w-full"
                src={asset.path}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            )}
            {asset.type === "image" && (
              <img src={asset.path} className="h-[405px] w-full" />
            )}
          </div>
        </div>
        <InfoCards />
        <PartnersCarousel />
      </div>
    </section>
  );
}
