import type { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { StatsProps } from "../components/home/heroSection/Stats";
import Layout from "../components/_shared/Layout";
import { CKAN } from "@portaljs/ckan";
import { env } from "@env.mjs";
import DatasetsSection from "@components/home/mainSection/DatasetsSection";
import ContributeSection from "@components/home/mainSection/ContributeSection";
import FaqsSection from "@components/home/mainSection/FaqsSection";
import TestimonialsSection from "@components/home/mainSection/TestimonialsSection";
import NewsLetterSignUpSection from "@components/_shared/NewsletterSection";
import Hero from "@components/data-provider/Hero";
import HowDatasetWorks from "@components/data-provider/HowDatasetWorks";

export default function Home(): JSX.Element {
  return (
    <>
      <Head>
        <title>Transport Data Commons</title>
        <meta name="description" content="Transport Data Commons" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout greenGradiendBackground>
        <Hero />
        <HowDatasetWorks />
        <ContributeSection />
        <TestimonialsSection />
        <FaqsSection />
        <NewsLetterSignUpSection />
      </Layout>
    </>
  );
}
