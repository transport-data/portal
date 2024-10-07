import Layout from "@components/_shared/Layout";
import Head from "next/head";
import clientPromise from "@lib/mddb.mjs";
import fs from "fs";
import HeroSection from "@components/about-us/HeroSection";
import PeopleSection from "@components/about-us/PeopleSection";
import EventsSection from "@components/about-us/EventsSection";
import CommunitySection from "@components/about-us/CommunitySection";
import NewsLetterSection from "@components/_shared/NewsletterSection";
import { PhoneIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

export default function AboutUsPage({}) {
  return (
    <>
      <Head>
        <title>Contact Us</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout fullScreen={false}>
        <section className="container mt-[96px] text-center">
          <div className="m-auto mb-[16px] flex w-fit flex-col items-center justify-center rounded-[8px] bg-gray-100 p-2 text-gray-500">
            <PhoneIcon width={38} />
          </div>
          <h1 className="mb-2 text-[20px] text-xl font-bold leading-[30px] text-gray-900">
            Conctact Us
          </h1>
          <p className="mb-2 text-gray-500">
            Thank you for your interest in Transport Data Commons!
            <br></br>
            For general inquiries, to join the initiative, or any other
            questions,
            <br></br>please feel free to reach out to us via 📧 Email:
          </p>
          <Link
            className="text-base font-semibold"
            href="email:contact@transport-data.org"
          >
            contact@transport-data.org
          </Link>
        </section>
        <section className="container mb-[96px] mt-10 text-center">
          <h1 className="mb-2 text-[18px] text-xl font-bold leading-[28px] text-gray-900">
            Data-Related Issues
          </h1>
          <p className="mb-2 text-gray-500">
            If you have questions, suggestions, or encounter issues related to
            our data, <br></br>we encourage you to use our GitHub Issues Board .
            <br></br>
            This helps us respond faster and track all data-related feedback
            effectively.<br></br>
            <Link
              className="mt-2 inline-block text-base font-semibold text-gray-900"
              href="https://github.com/orgs/transport-data/projects/4/views/1"
            >
              🔗 GitHub Issues Board
            </Link>
          </p>
          <p className="text-gray-500">
            We appreciate your contributions and feedback!
          </p>
        </section>
        <NewsLetterSection />
      </Layout>
    </>
  );
}
