import Heading from "@components/_shared/Heading";
import Subheading from "@components/_shared/SubHeading";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import {
  ArrowRightIcon,
  BuildingLibraryIcon,
  ClockIcon,
  MapPinIcon,
} from "@heroicons/react/20/solid";
import { formatDatePeriod } from "@lib/utils";
import { EventsProps } from "@pages/about-us";
import Link from "next/link";
import Markdown from "react-markdown";
import remarkFrontmatter from "remark-frontmatter";

export default function EventsSection({
  events,
}: {
  events: Array<EventsProps>;
}) {
  return (
    <section className="container flex flex-col pb-[96px]">
      <div className="mx-auto lg:max-w-[672px]">
        <Heading>Events</Heading>
        <Subheading className="mt-4">
          Unlocking the Potential of Transportation Data: Insights, Innovations,
          and Best Practices for a Sustainable Future.
        </Subheading>
      </div>
      <div className="mb-[32px] mt-[96px] grid grid-cols-1 gap-x-[32px] gap-y-[48px] md:grid-cols-2">
        {events.map((event, i) => (
          <div
            key={`event-${i}`}
            className="flex flex-col gap-4 rounded-lg   bg-white p-[24px] shadow-md"
          >
            <Badge
              variant={"success"}
              icon={<ClockIcon width={16} />}
              className="bg-[#E3F9ED] text-[#006064]"
            >
              {formatDatePeriod(event.from ?? "", event.to ?? "")}
            </Badge>
            <img
              src={event.image}
              className="h-[192px] w-full rounded-[8px] object-cover object-center"
            />
            <span className="block text-xl font-bold">{event.title}</span>
            <div className="text-gray-500">
              <Markdown remarkPlugins={[remarkFrontmatter]}>
                {event.source}
              </Markdown>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-[2.5px] text-gray-500">
                <BuildingLibraryIcon width={16} />
                <span className="text-sm font-medium">
                  {event.organization}
                </span>
              </div>
              <div className="flex items-center gap-[2.5px] text-gray-500">
                <MapPinIcon width={16} />
                <span className="text-sm font-medium">{event.location}</span>
              </div>
            </div>
            <Button
              variant="outline"
              className="border-gray flex w-fit items-center gap-2 hover:bg-gray-100 hover:text-gray-900"
            >
              Show details
              <ArrowRightIcon width={20} />
            </Button>
          </div>
        ))}
      </div>
      <Link
        href="#"
        className="flex items-center gap-[6px] self-center text-accent"
      >
        View all
        <ArrowRightIcon width={20} />
      </Link>
    </section>
  );
}
