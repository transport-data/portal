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
import { Faq } from "@interfaces/faq.interface";
import path from "path";

export const getStaticProps = async () => {
  let tdcConfig = {
    hero: {
      path: "/images/video-thumbnail.png",
      type: "image",
    },
  };
  try {
    const tdcConfigPath = path.join(process.cwd(), "public", "tdc-config.json");
    const tdcConfigContent = fs.readFileSync(tdcConfigPath, "utf8");
    tdcConfig = tdcConfigContent ? JSON.parse(tdcConfigContent) : {};
  } catch (err) {
    console.log(err);
  }
  const mddb = await clientPromise;
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
      tdcConfig,
      faqs,
    },
  };
};

export default function DataProviderPage({
  tdcConfig,
  faqs,
}: {
  tdcConfig: any;
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
          <HowToAddData asset={tdcConfig.video} />
          <FaqsSection faqs={faqs} />
          <NewsLetterSignUpSection />
        </div>
      </Layout>
    </>
  );
}
