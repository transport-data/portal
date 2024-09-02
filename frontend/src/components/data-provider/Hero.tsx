import { Button } from "@components/ui/button";

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-[#E3F9ED] to-white to-40% pb-6 md:pb-[96px] pt-[64px]">
      <div className="container">
        <div className="flex items-center gap-x-16 xl:items-start">
          <div className="flex w-full flex-col items-center">
            <h2 className="mb-[24px] mt-[20px] text-center text-[40px] font-extrabold leading-none text-gray-900 sm:text-[40px] lg:text-6xl">
              Contribute data to the Transport Data Commons
            </h2>
            <p className="mb-8 text-center text-xl leading-[30px] text-gray-500">
              Help us build a more comprehensive and diverse transportation data
              repository by contributing your own transportation-related
              datasets.
            </p>
            <Button className="mb-16 bg-[#006064] px-6 py-3.5">
              Add data to TDC
            </Button>
            <p className="font-semibold text-gray-500">
              Join organisation which already provide data to TDC
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
            src={"/images/logos/partners/ifeu-colored.svg"}
          />
          <img
            className="object-contain"
            src={"/images/logos/partners/oxford-colored.svg"}
          />
          <img
            className="object-contain"
            src={"/images/logos/partners/ricardo-colored.svg"}
          />
          <img
            className="object-contain"
            src={"/images/logos/partners/kfw-colored.svg"}
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
            src={"/images/logos/partners/ebrd-colored.svg"}
          />
          <img
            className="object-contain"
            src={"/images/logos/partners/solcat-colored.svg"}
          />
          <img
            className="object-contain"
            src={"/images/logos/partners/fia-colored.svg"}
          />
          <img
            className="object-contain"
            src={"/images/logos/partners/irf-colored.svg"}
          />
          <img
            className="object-contain"
            src={"/images/logos/partners/chalmers-colored.svg"}
          />
          <img
            className="object-contain"
            src={"/images/logos/partners/fdm-colored.svg"}
          />
          <img
            className="object-contain"
            src={"/images/logos/partners/iiasa-colored.svg"}
          />
          <img
            className="object-contain"
            src={"/images/logos/partners/sei-colored.svg"}
          />
          <img
            className="object-contain"
            src={"/images/logos/partners/joint-colored.svg"}
          />
          <img
            className="object-contain"
            src={"/images/logos/partners/uc-davis-colored.svg"}
          />
          <img
            className="object-contain"
            src={"/images/logos/partners/wri-colored.svg"}
          />
          <img
            className="object-contain md:pl-12"
            src={"/images/logos/partners/itdp-colored.svg"}
          />
          <img
            className="object-contain"
            src={"/images/logos/partners/mobilise-colored.svg"}
          />
          <img
            className="object-contain"
            src={"/images/logos/partners/ccg-colored.svg"}
          />
          <img
            className="object-contain"
            src={"/images/logos/partners/sumc-colored.svg"}
          />
          <img
            className="object-contain"
            src={"/images/logos/partners/gnpt-colored.svg"}
          />
          <img
            className="object-contain md:pl-6"
            src={"/images/logos/partners/tumi-colored.svg"}
          />
          <img
            className="object-contain"
            src={"/images/logos/partners/loughbrough-colored.svg"}
          />
          <img
            className="object-contain"
            src={"/images/logos/partners/itf-colored.svg"}
          />
          <img
            className="object-contain"
            src={"/images/logos/partners/icct-colored.svg"}
          />
          <img
            className="object-contain"
            src={"/images/logos/partners/the-world-bank-colored.svg"}
          />
          <img
            className="object-contain"
            src={"/images/logos/partners/cgep-colored.svg"}
          />
        </div>
      </div>
    </section>
  );
}
