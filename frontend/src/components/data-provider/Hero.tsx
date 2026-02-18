import { Button } from "@components/ui/button";
import Link from "next/link";
import { Building2 } from "lucide-react";

export default function Hero() {
  return (
    <section className="pb-6 pt-[64px] md:pb-[96px]">
      <div className="container">
        <div className="flex items-center gap-x-16 xl:items-start">
          <div className="flex w-full flex-col items-center">
            <h2 className="mb-[24px] mt-[20px] text-center text-[40px] font-extrabold leading-none text-gray-900 sm:text-[40px] lg:text-6xl">
              Contribute data to the <br />Transport Data Commons
            </h2>
            <p className="mb-8 text-center text-xl leading-[30px] text-gray-500">
              Help us build a more comprehensive and diverse transportation data
              repository 
              by contributing your own transportation-related
              datasets.
            </p>
            <Button asChild className="mb-16 bg-[#006064] px-6 py-3.5">
              <a href="https://civicrm.changing-transport.org/form/tdci-newsletter" target="_blank" rel="noopener noreferrer">Start Contributing Data</a>
            </Button>
            <p className="font-semibold text-gray-500">
              Join the organisations which already share their data via the TDC.
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
        {/* Organisation CTA */}
        <div className="mt-12 flex flex-col items-center justify-between gap-6 rounded-2xl bg-gradient-to-r from-[#006064] to-[#00838f] px-8 py-8 shadow-lg sm:flex-row">
          <div className="flex items-center gap-5">
            <div className="hidden sm:inline-flex rounded-full bg-white/20 p-4 shrink-0">
              <Building2 className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">
                Don't see your organisation?
              </p>
              <p className="mt-1 text-sm text-white/80">
                Register your organisation and start contributing data to the Transport Data Commons.
              </p>
            </div>
          </div>
          <Button asChild className="shrink-0 bg-white text-[#006064] hover:bg-white/90 px-6 py-3 font-semibold shadow-md hover:shadow-lg transition-all hover:scale-105">
            <a
              href="https://civicrm.changing-transport.org/form/tdci-newsletter"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              <Building2 className="h-4 w-4" />
              Register my Organisation
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
