import NewsLetterSignUpSection from "@components/_shared/NewsletterSection";
import AddDataSection from "@components/data-provider/AddDataSection";
import Hero from "@components/data-provider/Hero";
import HowDatasetWorks from "@components/data-provider/HowDatasetWorks";
import HowToAddData from "@components/data-provider/HowToAddData";
import FaqsSection from "@components/home/mainSection/FaqsSection";
import Head from "next/head";
import Layout from "../components/_shared/Layout";

export default function Home(): JSX.Element {
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
          <FaqsSection />
          <NewsLetterSignUpSection />
        </div>
      </Layout>
    </>
  );
}
