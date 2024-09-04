import Heading from "@components/_shared/Heading";
import Layout from "@components/_shared/Layout";
import { Button } from "@components/ui/button";
import {
  ArrowLongRightIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/20/solid";
import { partnersList } from "@static-db/partners";
import Head from "next/head";
import Link from "next/link";
import NewsLetterSignUpSection from "@components/_shared/NewsletterSection";

export default function PartnersPage(): JSX.Element {
  return (
    <>
      <Head>
        <title>Partnets and Doners</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="container py-[96px] ">
          <div className="mx-auto flex flex-col items-center gap-4 lg:max-w-[672px]">
            <Heading>Partners & Donors</Heading>
            <p className="text-center text-xl font-normal text-gray-500">
              TDC partners with leading organisations, institutions, and
              industry stakeholders in the sustainable transportation sector to
              foster collaboration, leverage expertise, and collectively advance
              the impact and accessibility of transport-related data.
            </p>
            <Link
              className="flex items-center gap-[6px] text-base font-medium text-accent"
              href="#"
            >
              Become a partner
              <ArrowLongRightIcon width={20} />
            </Link>
          </div>
          <div className="mt-[64px] grid grid-cols-1 gap-[64px] sm:grid-cols-2 lg:grid-cols-4">
            {partnersList.map((item, idx) => {
              return (
                <div
                  key={`partner-${idx}`}
                  className="flex flex-col items-center justify-center gap-y-[20px] text-center"
                >
                  <div className="">
                    <img
                      src={item.image}
                      className="mx-auto mb-[10px] max-h-[48px] w-full object-contain"
                    />
                    <span className=" text-xs font-normal leading-tight text-gray-500">
                      {item.name}
                    </span>
                  </div>
                  <Button
                    className="flex items-center gap-[8px] border border-gray-200 text-xs font-medium hover:bg-gray-100
"
                    variant="ghost"
                    size="sm"
                  >
                    <ArrowTopRightOnSquareIcon width={16} />
                    Vistit website
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
        <NewsLetterSignUpSection />
      </Layout>
    </>
  );
}
