import Layout from "@components/_shared/Layout";
import Head from "next/head";
import clientPromise from "@lib/mddb.mjs";
import fs from "fs";

import NewsLetterSection from "@components/_shared/NewsletterSection";
import Heading from "@components/_shared/Heading";
import { Badge } from "@components/ui/badge";
import { ClockIcon } from "@heroicons/react/20/solid";
import { formatDatePeriod } from "@lib/utils";
import EventCard from "@components/events/EventCard";

export type EventsProps = {
  title: string;
  from?: string;
  to?: string;
  image?: string;
  organization?: string;
  location?: string;
  source?: string;
};

export default function EventsPage({
  upcoming,
  past,
}: {
  upcoming: Array<EventsProps>;
  past: Array<EventsProps>;
}) {
  const [highlighted, ...rest] = upcoming;
  const otherEvents = rest?.splice(0, 2);
  const otherEventsSize = otherEvents.length;
  return (
    <>
      <Head>
        <title>Events</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="container pt-[96px] lg:max-w-[1024px]">
          <Heading
            align="left"
            className="border-b border-gray-200 pb-[20px] pt-[40px]"
          >
            Upcoming Events
          </Heading>
          {upcoming.length > 1 ? (
            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2">
              <div className="py-[20px]">
                {highlighted && <EventCard {...highlighted} />}
              </div>
              <div className="border-gray-200 pb-[20px] md:border-l md:py-[20px] ">
                {otherEvents.map((event, i) => {
                  return (
                    <div
                      className={`border-gray-200  md:pl-[20px] ${
                        i < otherEventsSize - 1
                          ? "pb-[20px] md:border-b"
                          : "pt-[20px]"
                      }`}
                    >
                      <EventCard
                        key={`event-${i}`}
                        {...event}
                        showImage={false}
                        className={`rounded-none `}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="mt-8">No upcoming events available</div>
          )}
        </div>
        <div className="container pb-[96px] pt-[72px] lg:max-w-[1024px]">
          <Heading
            align="left"
            className="border-b border-gray-200 pb-[20px] pt-[40px]"
          >
            Past Events
          </Heading>
          <div className="relative grid grid-cols-1 gap-[40px] md:grid-cols-2">
            {past.length > 0 ? (
              past.map((event, i) => {
                return (
                  <div className="col-span-1 pt-[20px]">
                    <EventCard
                      key={`event-${i}`}
                      {...event}
                      showImage={false}
                      className={`rounded-none `}
                    />
                  </div>
                );
              })
            ) : (
              <div className="mt-8">No past events available</div>
            )}

            <div className="absolute inset-y-0 left-1/2 hidden w-[1px] bg-gray-200 md:block"></div>
          </div>
        </div>
        <NewsLetterSection />
      </Layout>
    </>
  );
}

export const getStaticProps = async () => {
  const mddb = await clientPromise;
  const eventsFiles = await mddb.getFiles({
    folder: "events",
  });
  const events = eventsFiles.map((file) => {
    let source = fs.readFileSync(file.file_path, { encoding: "utf-8" });
    return {
      ...file.metadata,
      source,
    } as EventsProps;
  });

  const now = new Date();

  const upcomingEvents = events.filter(
    (event) => new Date(event.from ?? "") > now
  );
  const pastEvents = events.filter(
    (event) => new Date(event.from ?? "") <= now
  );

  return {
    props: {
      upcoming: upcomingEvents.sort(
        (a, b) =>
          new Date(a.from ?? "").getTime() - new Date(b.from ?? "").getTime()
      ),
      past: pastEvents.sort(
        (a, b) =>
          new Date(b.from ?? "").getTime() - new Date(a.from ?? "").getTime()
      ),
    },
  };
};
