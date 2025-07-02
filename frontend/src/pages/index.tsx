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
import { api } from "@utils/api";

export const getStaticProps = async () => {
  const mddb = await clientPromise;
  let tdcConfig = {
    hero: {
      path: "/images/video-thumbnail.png",
      type: "image",
    },
  };
  //fetch tdc hero asset
  try {
    const tdcConfigPath = path.join(process.cwd(), "public", "tdc-config.json");
    const tdcConfigContent = fs.readFileSync(tdcConfigPath, "utf8");
    tdcConfig = tdcConfigContent ? JSON.parse(tdcConfigContent) : {};
  } catch (err) {
    console.log(err);
  }

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
  const desiredFiles = ["question01.md", "question02.md", "question03.md", "question04.md"];
  const faqs = faqsFiles
    /* previously: added 5 last edited faqs
    ?.filter((f) => f.metadata?.category !== "intro")
    */
    // now: selection of specific faq questions regarding data submission
    ?.filter((f) => desiredFiles.includes(path.basename(f.file_path)))
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
    /* previously: added 5 last edited faqs
    .sort(
      (a, b) =>
        new Date(b.modified ?? "").getTime() -
        new Date(a.modified ?? "").getTime()
    )
    .slice(0, 4);
    */

  return {
    props: {
      tdcConfig,
      testimonials,
      faqs,
    },
  };
};

export default function Home({
  tdcConfig,
  testimonials,
  faqs,
}: {
  tdcConfig: any;
  testimonials: Testimonial[];
  faqs: Faq[];
}) {
  //fetch datasets
  const { data, isLoading } = api.dataset.search.useQuery({
    limit: 6,
    sort: "metadata_modified desc",
  });

  return (
    <>
      <Head>
        <title>Transport Data Commons</title>
        <meta name="description" content="Transport Data Commons" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Hero asset={tdcConfig.hero} />
        <DatasetsSection
          datasets={data?.datasets ?? []}
          isLoading={isLoading}
        />
        <ContributeSection />
        <TestimonialsSection testimonials={testimonials} />
        <FaqsSection faqs={faqs} />
        <NewsLetterSignUpSection />
      </Layout>
    </>
  );
}
