import Heading from "@components/_shared/Heading";
import Subheading from "@components/_shared/SubHeading";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

export default function CommunitySection({}: {}) {
  return (
    <section className="container flex flex-col pb-[96px]">
      <div className="mx-auto lg:max-w-[672px]">
        <Heading>Our Community</Heading>
        <Subheading className="mt-4">
          Unlocking the Potential of Transportation Data: Insights, Innovations,
          and Best Practices for a Sustainable Future.
        </Subheading>
      </div>
      <div className="mb-[32px] mt-[48px] grid grid-cols-1 gap-x-[32px] gap-y-[48px] md:grid-cols-2 lg:grid-cols-3">
        <div className="card flex flex-col gap-[12px] p-6 shadow-md">
          <div className="flex items-center gap-[12px]">
            <Avatar>
              <AvatarFallback className="bg-gray-300">BG</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="gray-900 text-sm font-medium leading-tight">
                Bonnie Green
              </span>
              <span className="text-sm font-normal leading-tight text-gray-500">
                Posted in 📚 <span className="font-bold">Sources</span> • 3
                weeks ago
              </span>
            </div>
          </div>
          <div className="gap flex flex-col gap-4">
            <h5 className="text-2xl font-bold leading-tight">UIC</h5>
            <p className="text-gray-500">
              The Union Internationale des Chemins de fer UIC International
              Union of Railways has a statistics unit: Information about the
              unit and its activities
            </p>
            <Link
              href="#"
              className="flex items-center gap-[6px] text-base font-semibold"
            >
              View all
              <ArrowRightIcon width={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
