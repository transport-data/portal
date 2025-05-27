import Heading from "@components/_shared/Heading";
import Carousel from "@components/_shared/PartnersCarousel";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="container lg:py-[96px]">
      <div className="flex flex-col gap-x-[32px] gap-y-[64px] lg:flex-row">
        <div className="flex w-full flex-col gap-4 lg:w-1/2">
          <Heading align="left">
            About Transport Data Commons Initiative
          </Heading>
        </div>
        <div className="flex w-full flex-col gap-4 lg:w-1/2">
          <p className="text-lg font-normal text-gray-500">
            Transport Data Commons is an initiative of individuals and
            organisations who are passionate about sustainable transportation
            and want to increase the use and impact of data in this sector. Our
            focus is on creating a common platform where transport-related data
            can be shared, analyzed, and utilized to help make informed
            decisions and create sustainable transportation solutions.
          </p>
          <p className="text-lg font-normal text-gray-500">
            Through collaboration and open sharing of data, our aim is to foster
            innovation and drive positive change in the transportation industry.
          </p>
          <Link
            href="/partners"
            className="flex items-center gap-1 text-lg font-medium leading-none text-accent"
          >
            Full list of participating organisations{" "}
            <ChevronRightIcon width={16} />
          </Link>
        </div>
      </div>
      <div className="mt-[64px]">
        <Carousel />
      </div>
    </section>
  );
}
