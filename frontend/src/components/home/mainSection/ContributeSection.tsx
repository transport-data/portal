import Heading from "@components/_shared/Heading";
import { Button } from "@components/ui/button";
import { ArrowRightIcon, CheckIcon } from "@heroicons/react/20/solid";
import Image from "next/image";

export default function ContributeSection() {
  return (
    <div className="container py-[96px]">
      <div className="mx-auto text-center lg:max-w-[640px]">
        <Heading>Contribute data to the Transport Data Commons</Heading>
        <p className="mt-4 text-xl font-normal text-gray-500">
          Help us build a more comprehensive and diverse transportation data
          repository by contributing your own transportation-related datasets.
        </p>
      </div>
      <div className="mt-[96px] flex flex-col gap-[80px] sm:flex-row sm:items-center">
        <div className="hidden w-full max-w-[560px] lg:block">
          <Image
            alt="Contribute"
            src="/images/contribute-section.png"
            width={560}
            height={417}
          />
        </div>
        <div className="flex flex-col gap-[32px]">
          <div className="flex items-start gap-4">
            <span className="flex min-h-[32px] min-w-[32px] items-center justify-center rounded-full bg-green-100 text-green-500">
              <CheckIcon width={20} />
            </span>
            <div>
              <h4 className="text-xl font-bold text-gray-900">
                Increase the visibility of your data
              </h4>
              <p className="text-gray-500">
                Your data will be visible to a wider audience, including
                researchers, policy makers, and businesses, who can use it to
                inform their decisions.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="flex min-h-[32px] min-w-[32px] items-center justify-center rounded-full bg-purple-100 text-purple-500">
              <CheckIcon width={20} />
            </span>
            <div>
              <h4 className="text-xl font-bold text-gray-900">
                Make an impact
              </h4>
              <p className="text-gray-500">
                Contributing data to TDC can help inform the development of
                impactful and sustainable transportation solutions that can
                benefit society and the environment.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="flex min-h-[32px] min-w-[32px] items-center justify-center rounded-full bg-yellow-100 text-yellow-500">
              <CheckIcon width={20} />
            </span>
            <div>
              <h4 className="text-xl font-bold text-gray-900">
                Improve your data quality
              </h4>
              <p className="text-gray-500">
                Your data will be visible to a wider audience, including
                researchers, policy makers, and businesses, who can use it to
                inform their decisions.
              </p>
            </div>
          </div>
          <hr className="h-[1px] border-gray-200" />
          <div className="flex gap-4">
            <Button className="flex gap-2">
              Add data
              <ArrowRightIcon width={20} />
            </Button>
            <Button className="border border-gray-200" variant="ghost">
              Add data
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
