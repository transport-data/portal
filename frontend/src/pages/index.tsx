import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Hero from "../components/home/heroSection/Hero";
import Layout from "../components/_shared/Layout";
import DatasetsSection from "@components/home/mainSection/DatasetsSection";
import ContributeSection from "@components/home/mainSection/ContributeSection";
import FaqsSection from "@components/home/mainSection/FaqsSection";
import TestimonialsSection from "@components/home/mainSection/TestimonialsSection";
import NewsLetterSignUpSection from "@components/_shared/NewsletterSection";
import { Dataset } from "@interfaces/ckan/dataset.interface";
import { getSession } from "next-auth/react";
import { searchDatasets } from "@utils/dataset";
import clientPromise from "@lib/mddb.mjs";
import fs from "fs";
import path from "path";
import { Testimonial } from "@interfaces/testimonial.interface";
import { Faq } from "@interfaces/faq.interface";

export const getServerSideProps: GetServerSideProps<any> = async (context) => {
  const session = await getSession(context);
  const mddb = await clientPromise;
  let tdcConfig = {
    hero: {
      path: "/images/video-thumbnail.png",
      type: "image",
    },
  };
  //fetch tdc hero asset
  /* try {
    const tdcConfigPath = path.join(process.cwd(), "public", "tdc-config.json");
    const tdcConfigContent = fs.readFileSync(tdcConfigPath, "utf8");
    tdcConfig = tdcConfigContent ? JSON.parse(tdcConfigContent) : {};
  } catch (err) {
    console.log(err);
  }
*/
  //fetch datasets
  const { datasets } = await searchDatasets({
    apiKey: session?.user.apikey ?? "",
    options: {
      limit: 6,
      sort: "metadata_modified desc",
    },
  });
  //fetch testimonials
  const testimonialsFiles = await mddb.getFiles({
    folder: "testimonials",
  });
  const testimonials = testimonialsFiles.map((file) => {
    let source = fs.readFileSync(file.file_path, { encoding: "utf-8" });
    return {
      ...file.metadata,
      source,
    } as Testimonial;
  });
  //fetch faqs
  const faqsFiles = await mddb.getFiles({
    folder: "faq",
  });
  const faqs = faqsFiles
    .filter((f) => f.metadata?.category !== "intro")
    .map((file) => {
      let source = fs.readFileSync(file.file_path, { encoding: "utf-8" });
      let stat = fs.statSync(file.file_path);
      return {
        ...file.metadata,
        created: stat.birthtime.toJSON(),
        modified: stat.mtime.toJSON(),
        source,
      } as Faq;
    })
    .sort(
      (a, b) =>
        new Date(b.modified ?? "").getTime() -
        new Date(a.modified ?? "").getTime()
    )
    .slice(0, 4);

  return {
    props: {
      tdcConfig,
      datasets,
      testimonials,
      faqs,
    },
  };
};

export default function Home({
  tdcConfig,
  datasets,
  testimonials,
  faqs,
}: {
  tdcConfig: any;
  datasets: Dataset[];
  testimonials: Testimonial[];
  faqs: Faq[];
}) {
  return (
    <>
      <Head>
        <title>Transport Data Commons</title>
        <meta name="description" content="Transport Data Commons" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Hero asset={tdcConfig.hero} />
        <DatasetsSection datasets={datasets} />
        <ContributeSection />
        <TestimonialsSection testimonials={testimonials} />
        <FaqsSection faqs={faqs} />
        <NewsLetterSignUpSection />
      </Layout>
    </>
  );
}
