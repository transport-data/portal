import Heading from "@components/_shared/Heading";
import Subheading from "@components/_shared/SubHeading";
import EventCard from "@components/events/EventCard";
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
  const hasEvents = events.length > 0;
  
  return (
    <section className="container flex flex-col pb-[96px]">
      <div className="mx-auto lg:max-w-[672px]">
        <Heading>Events</Heading>
        <Subheading className="mt-4">
          Explore opportunities to connect, collaborate, and contribute through upcoming events, 
          workshops, and community sessions around the TDC Portal and transport data.
        </Subheading>
      </div>

      {hasEvents ? (
        <div className="mb-[32px] mt-[96px] grid grid-cols-1 gap-x-[32px] gap-y-[48px] md:grid-cols-2">
          {events.map((event, i) => (
            <EventCard
              key={`event-${i}`}
              className="rounded-lg bg-white p-[24px] shadow-md"
              {...event}
            />
          ))}
        </div>
      ) : (
        <div className="mt-[96px] mb-[32px] text-center text-gray-500">
          Nothing scheduled just yet — but we’re working on new ways to connect and collaborate. Check back soon!
        </div>
      )}
      
      <Link
        href="/events"
        className="flex items-center gap-[6px] self-center text-accent"
      >
        View all
        <ArrowRightIcon width={20} />
      </Link>
    </section>
  );
}
