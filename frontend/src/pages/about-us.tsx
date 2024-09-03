import Layout from "@components/_shared/Layout";
import Head from "next/head";

export default function AboutUsPage(): JSX.Element {
  return (
    <>
      <Head>
        <title>About Us</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout backgroundEffect={true}>
        <div className="container">lorem</div>
      </Layout>
    </>
  );
}
