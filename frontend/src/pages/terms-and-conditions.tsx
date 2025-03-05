import Layout from "@components/_shared/Layout";
import { DefaultBreadCrumb } from "@components/ui/breadcrumb";
import clientPromise from "@lib/mddb.mjs";
import fs from "fs";
import { ChevronLeftIcon } from "lucide-react";
import { MddbFile } from "mddb/dist/src/lib/schema";
import Markdown from "react-markdown";
import remarkFrontmatter from "remark-frontmatter";
import * as R from "remeda";

const breadcrumbs = [
  {
    href: `/`,
    label: "Home",
  },
  {
    href: `/terms-and-conditions`,
    label: `Terms and Conditions`,
  },
];

export const getStaticProps = async () => {
  const mddb = await clientPromise;
  // get all files that are not marked as draft in the frontmatter
  const privacyAndPolicyFiles = await mddb.getFiles({
    folder: "terms-and-conditions",
  });
  const termsAndConditions = R.groupBy(
    privacyAndPolicyFiles.map((file) => {
      let source = fs.readFileSync(file.file_path, { encoding: "utf-8" });
      return {
        filePath: file.file_path,
        title: file.metadata?.title || "No title",
        category: file.metadata?.category || "other",
        source,
      };
    }),
    R.prop("category")
  );
  return {
    props: {
      termsAndConditions,
    },
  };
};

export default function Faq({
  termsAndConditions,
}: {
  termsAndConditions: Record<string, MddbFile[]>;
}) {
  return (
    <Layout backgroundEffect effectSize="1.5%">
      <div className="w-full">
        <div className="container py-8">
          <div>
            <nav aria-label="Back" className="sm:hidden">
              <button
                onClick={() => window.history.back()}
                className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                <ChevronLeftIcon
                  aria-hidden="true"
                  className="-ml-1 mr-1 h-3.5 w-3.5 flex-shrink-0 text-gray-400"
                />
                Back
              </button>
            </nav>
            <nav aria-label="Breadcrumb" className="hidden sm:flex">
              <DefaultBreadCrumb links={breadcrumbs} />
            </nav>
          </div>
        </div>
      </div>

      <div className="mb-12 flex w-full flex-col items-center justify-center">
        <div className="shrink grow basis-0 pb-4 text-2xl font-bold leading-9 text-primary">
          {termsAndConditions?.other[0]?.title}
        </div>
        <div className="prose prose-p:mt-2 prose-p:text-base prose-p:text-gray-500 prose-a:text-accent prose-a:no-underline prose-ul:mt-2 prose-li:m-0 prose-li:text-base prose-li:text-gray-500">
          <Markdown remarkPlugins={[remarkFrontmatter]}>
            {
              // @ts-ignore
              termsAndConditions["other"][0]["source"]
            }
          </Markdown>
        </div>
      </div>
    </Layout>
  );
}
