import Layout from "@components/_shared/Layout";
import Head from "next/head";
import clientPromise from "@lib/mddb.mjs";
import fs from "fs";
import HeroSection from "@components/about-us/HeroSection";
import PeopleSection from "@components/about-us/PeopleSection";
import EventsSection from "@components/about-us/EventsSection";
import CommunitySection from "@components/about-us/CommunitySection";
import NewsLetterSection from "@components/_shared/NewsletterSection";

export type PersonProps = {
  title: string;
  info?: string;
  image?: string;
  source?: string;
};

export type EventsProps = {
  title: string;
  from?: string;
  to?: string;
  image?: string;
  organization?: string;
  location?: string;
  source?: string;
};

export default function AboutUsPage({
  people,
  events,
}: {
  people: Array<PersonProps>;
  events: Array<EventsProps>;
}) {
  return (
    <>
      <Head>
        <title>About Us</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout backgroundEffect={true}>
        {/* hero section*/}
        <HeroSection />
        {/* people section*/}
        <PeopleSection people={people} />
        {/* events section*/}
        <EventsSection events={events} />
        {/* community */}
        <CommunitySection />
        {/* signup */}
        <NewsLetterSection />
      </Layout>
    </>
  );
}

export const getStaticProps = async () => {
  const mddb = await clientPromise;
  const peopleFiles = await mddb.getFiles({
    folder: "people",
  });
  const eventsFiles = await mddb.getFiles({
    folder: "events",
  });
  return {
    props: {
      people: peopleFiles.map((file) => {
        let source = fs.readFileSync(file.file_path, { encoding: "utf-8" });
        return {
          title: file.metadata?.title || "",
          info: file.metadata?.info || "",
          image: file.metadata?.image || "/images/people/placeholder.png",
          source,
        } as PersonProps;
      }),
      events: eventsFiles.slice(0, 2).map((file) => {
        let source = fs.readFileSync(file.file_path, { encoding: "utf-8" });
        return {
          ...file.metadata,
          source,
        } as EventsProps;
      }),
    },
  };
};
