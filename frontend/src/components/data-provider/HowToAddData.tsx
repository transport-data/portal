import { Button } from "@components/ui/button";
import Link from "next/link";
import HowToAsset from "@components/_shared/HowToAsset";
import { HeroAsset } from "@components/home/heroSection/Hero";

export default ({ asset }: { asset: HeroAsset }) => {
  return (
    <div className="space-y-8 py-6 text-gray-500 md:py-[96px]">
      <div>
        <h1 className="text-center text-4xl font-extrabold text-gray-900">
          How to add data to TDC?
        </h1>
        <p className="mt-4 text-center text-xl font-normal text-gray-500">
          Watch this short tutorial video guiding you step-by-step on how to add
          data to the Transport Data Commons.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
        <Button className="bg-white text-[#1F2A37] ring-1 ring-[#E5E7EB] hover:bg-white hover:opacity-80">
          <Link
            href="https://github.com/orgs/transport-data/discussions"
            target="_blank"
          >
            TDC data submission guidelines
          </Link>
        </Button>
        <Button className="bg-white text-[#1F2A37] ring-1 ring-[#E5E7EB] hover:bg-white hover:opacity-80">
          <Link href="/faq#submitting_data">Data submission FAQ</Link>
        </Button>
      </div>
      <div className="flex w-full items-center justify-center">
        <div className="w-[804px] max-w-[804px]">
          <HowToAsset
            assetType={asset.type}
            assetPath={asset.path}
            heightInPx="460px"
          />
        </div>
      </div>
    </div>
  );
};

const LongArrowRightIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="200"
    height="24"
    viewBox="0 0 200 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M201.061 13.0607C201.646 12.4749 201.646 11.5251 201.061 10.9393L191.515 1.3934C190.929 0.807611 189.979 0.807611 189.393 1.3934C188.808 1.97919 188.808 2.92893 189.393 3.51472L197.879 12L189.393 20.4853C188.808 21.0711 188.808 22.0208 189.393 22.6066C189.979 23.1924 190.929 23.1924 191.515 22.6066L201.061 13.0607ZM0 13.5H200V10.5H0V13.5Z"
      fill="#E5E7EB"
    />
  </svg>
);
