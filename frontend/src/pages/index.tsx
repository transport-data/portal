import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Hero from "../components/home/heroSection/Hero";
import { StatsProps } from "../components/home/heroSection/Stats";
import Layout from "../components/_shared/Layout";
import { CKAN } from "@portaljs/ckan";
import { env } from "@env.mjs";
import DatasetsSection from "@components/home/mainSection/DatasetsSection";
import ContributeSection from "@components/home/mainSection/ContributeSection";
import FaqsSection from "@components/home/mainSection/FaqsSection";
import TestimonialsSection from "@components/home/mainSection/TestimonialsSection";
import NewsLetterSignUpSection from "@components/_shared/NewsletterSection";
import { api } from "@utils/api";
import { Dataset } from "@interfaces/ckan/dataset.interface";
import { getSession } from "next-auth/react";
import { searchDatasets } from "@utils/dataset";

export const getServerSideProps: GetServerSideProps<any> = async (context) => {
  const session = await getSession(context);

  const backend_url = env.NEXT_PUBLIC_CKAN_URL;
  const ckan = new CKAN(backend_url);
  const { datasets } = await searchDatasets({
    apiKey: session?.user.apikey ?? "",
    options: {
      limit: 6,
      sort: "score desc, metadata_modified desc",
    },
  });

  return {
    props: {
      datasets,
    },
  };
};

export default function Home({ datasets }: { datasets: Dataset[] }) {
  return (
    <>
      <Head>
        <title>Transport Data Commons</title>
        <meta name="description" content="Transport Data Commons" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Hero />
        <DatasetsSection datasets={datasets} />
        <ContributeSection />
        <TestimonialsSection />
        <FaqsSection />
        <NewsLetterSignUpSection />
      </Layout>
    </>
  );
}
