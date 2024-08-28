import type { InferGetServerSidePropsType } from "next";
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

export async function getStaticProps() {
  const backend_url = env.NEXT_PUBLIC_CKAN_URL;
  const ckan = new CKAN(backend_url);
  const datasets = await ckan.packageSearch({
    offset: 0,
    limit: 5,
    tags: [],
    groups: [],
    orgs: [],
  });
  const groups = await ckan.getGroupsWithDetails();
  const orgs = await ckan.getOrgsWithDetails();
  const stats: StatsProps = {
    datasetCount: datasets.count,
    groupCount: groups.length,
    orgCount: orgs.length,
  };
  return {
    props: {
      datasets: datasets.datasets,
      groups,
      orgs,
      stats,
    },
  };
}

export default function Home({
  datasets,
  groups,
  orgs,
  stats,
}: InferGetServerSidePropsType<typeof getStaticProps>): JSX.Element {
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
      </Layout>
    </>
  );
}
