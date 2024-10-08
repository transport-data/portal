import NewsLetterSignUpSection from "@components/_shared/NewsletterSection";
import AddDataSection from "@components/data-provider/AddDataSection";
import Hero from "@components/data-provider/Hero";
import HowDatasetWorks from "@components/data-provider/HowDatasetWorks";
import HowToAddData from "@components/data-provider/HowToAddData";
import FaqsSection from "@components/home/mainSection/FaqsSection";
import Head from "next/head";
import Layout from "../components/_shared/Layout";
import clientPromise from "@lib/mddb.mjs";
import fs from "fs";
import path from "path";
import { Faq } from "@interfaces/faq.interface";
import { GetServerSideProps } from "next";

export default function DataProviderPage({
  faqs,
}: {
  faqs: Faq[];
}): JSX.Element {
  return (
    <>
      <Head>
        <title>Transport Data Commons</title>
        <meta name="description" content="Transport Data Commons" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout backgroundEffect effectSize="10%">
        <div className="container [&>*]:bg-transparent">
          <Hero />
          <HowDatasetWorks />
          <AddDataSection />
          <HowToAddData />
          <FaqsSection faqs={faqs} />
          <NewsLetterSignUpSection />
        </div>
      </Layout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<any> = async () => {
  const mddb = await clientPromise;

  //fetch faqs
  const faqsFiles = await mddb.getFiles({
    folder: "faq",
  });
  const faqs = faqsFiles
    ?.filter((f) => f.metadata?.category !== "intro")
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
      faqs,
    },
  };
};
