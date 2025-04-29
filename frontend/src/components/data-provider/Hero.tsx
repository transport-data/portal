import { Button } from "@components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Hero() {
  const [url, setUrl] = useState<string | null>();

  useEffect(() => {
    setUrl(window.location.host)
  }, [])

  return (
    <section className="pb-6 pt-[64px] md:pb-[96px]">
      <div className="container">
        <div className="flex items-center gap-x-16 xl:items-start">
          <div className="flex w-full flex-col items-center">
            <h2 className="mb-[24px] mt-[20px] text-center text-[40px] font-extrabold leading-none text-gray-900 sm:text-[40px] lg:text-6xl">
              Contribute data to the Transport Data Commons
            </h2>
            <p className="mb-8 text-center text-xl leading-[30px] text-gray-500">
              Help us build a more comprehensive and diverse transportation data
              repository 
              by contributing your own transportation-related
              datasets.
            </p>
            <Button asChild className="mb-16 bg-[#006064] px-6 py-3.5">
              <Link href={`https://${url}/dashboard/datasets/create`}>Add Data to TDC</Link>
            </Button>
            <p className="font-semibold text-gray-500">
              Join the organisations which already provide data to TDC.
            </p>
          </div>
        </div>
        <div className="mt-[54px] flex flex-wrap gap-16">
          <img
            className="object-contain md:pl-12"
            src={"/images/logos/partners/giz-colored.svg"}
          />
          <img
            className="object-contain"
            src={"/images/logos/partners/unece-colored.svg"}
          />
          <img
            className="object-contain"
            src={"/images/logos/partners/caf-colored.svg"}
          />
          <img
            className="object-contain"
            src={"/images/logos/partners/adb-colored.svg"}
          />
          <img
            className="object-contain"
            src={"/images/logos/partners/solcat-colored.svg"}
          />
          <img
            className="object-contain"
            src={"/images/logos/partners/irf-colored.svg"}
          />
          <img
            className="object-contain"
            src={"/images/logos/partners/iiasa-colored.svg"}
          />
          <img
            className="object-contain"
            src={"/images/logos/partners/joint-colored.svg"}
          />
          <img
            className="object-contain"
            src={"/images/logos/partners/ccg-colored.svg"}
          />
          <img
            className="object-contain"
            src={"/images/logos/partners/tumi-colored.svg"}
          />
          <img
            className="object-contain w-32 h-16"
            src={"/images/logos/partners/gfei-colored.jpg"}
          />
          <img
            className="object-contain w-32 h-16"
            src={"/images/logos/partners/oica-colored.jpg"}
          />
          <img
            className="object-contain w-32 h-16"
            src={"/images/logos/partners/climate-trace-colored.png"}
          />
        </div>
      </div>
    </section>
  );
}
