import Layout from "@components/_shared/Layout";
import fs from "fs";
import clientPromise from "@lib/mddb.mjs";
import { MddbFile } from "mddb/dist/src/lib/schema";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Markdown from "react-markdown";
import remarkFrontmatter from "remark-frontmatter";
import * as R from "remeda";
import { cn } from "@lib/utils";
import useHash from "@lib/useHash";
import { DefaultBreadCrumb } from "@components/ui/breadcrumb";
import { ChevronLeftIcon } from "lucide-react";
import NewsLetterSection from "@components/_shared/NewsletterSection";
import Head from "next/head";

const categories = {
  cc: { title: "Creative Commons Licenses" },
  odc: { title: "Open Data Commons Licenses" },
  other: { title: "Other Licenses" },
};

const breadcrumbs = [
  {
    href: `/`,
    label: "Home",
  },
  {
    href: `/licenses`,
    label: `Data Licenses`,
  },
];

export default function Licenses({
  licenseFiles,
}: {
  licenseFiles: Record<string, MddbFile[]>;
}) {
  const hash = useHash();
  
  return (
    <>
      <Head>
        <title>Data Licenses - Transport Data Commons</title>
        <meta
          name="description"
          content="Learn about data licenses on the Transport Data Commons, including Creative Commons, ODbL, and how to choose the right license for your data."
        />
      </Head>
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
            <div className="mt-6 pb-8 md:flex md:items-center md:justify-between">
              <div className="min-w-0 flex-1">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:tracking-tight">
                  Data Licenses
                </h2>
                <p className="mt-2 text-base text-gray-500">
                  Understanding licenses for transport data sharing and reuse
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container grid pb-8 lg:grid-cols-7 xl:gap-x-12">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-2">
            <div className="inline-flex w-full flex-col items-start justify-start gap-6 rounded-lg border border-gray-200 bg-gray-50 p-4 lg:max-w-fit lg:p-6 xl:p-8">
              <div className="text-base font-bold leading-normal text-primary">
                Quick Links
              </div>
              <div className="flex flex-col items-start justify-start gap-4">
                {R.entries(categories).map((category) => (
                  <a
                    key={category[0]}
                    href={`#${category[0]}`}
                    className={cn(
                      "text-sm font-medium leading-normal text-gray-500 hover:text-accent transition-colors",
                      hash && hash.includes(`${category[0]}`) && "text-accent"
                    )}
                  >
                    {category[1].title}
                  </a>
                ))}
              </div>
              <div className="pt-4 border-t border-gray-200 w-full">
                <a 
                  href="/faq" 
                  className="text-sm text-accent hover:underline"
                >
                  More questions? Visit our FAQ →
                </a>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-5">
            {/* Introduction */}
            <div className="pb-8">
              <div className="shrink grow basis-0 pb-4 text-2xl font-bold leading-9 text-primary">
                About Data Licenses
              </div>
              <div className="prose prose-p:mt-2 prose-p:text-base prose-p:text-gray-500 prose-a:text-accent prose-a:no-underline prose-ul:mt-2 prose-li:m-0 prose-li:text-base prose-li:text-gray-500">
                <Markdown remarkPlugins={[remarkFrontmatter]}>
                  {
                    // @ts-ignore
                    licenseFiles["intro"]?.[0]?.["source"] || ""
                  }
                </Markdown>
              </div>
            </div>

            {/* License Categories */}
            {R.entries(categories).map((category) => {
              const [_category, categoryMetadata] = category;
              let _licenses = licenseFiles[_category as keyof typeof categories] || [];
              
              // Sort by order field if present
              _licenses = R.sortBy(_licenses, (file) => 
                file.metadata?.order || 999
              );
              
              return (
                <div key={_category} className="py-4">
                  <div
                    id={_category}
                    className="shrink grow basis-0 pb-2 text-2xl font-bold leading-9 text-primary"
                  >
                    {categoryMetadata.title}
                  </div>
                  {_licenses.map((_license) => (
                    <Accordion key={_license.file_path} type="single" collapsible>
                      <AccordionItem value="item-1">
                        <AccordionTrigger className="border-b border-gray-200 py-4">
                          {_license.title}
                        </AccordionTrigger>
                        <AccordionContent className="py-4">
                          <div className="prose text-justify marker:text-accent prose-p:mt-2 prose-p:text-gray-500 prose-a:text-accent prose-a:underline prose-ul:mt-2 prose-li:m-0 prose-strong:text-gray-700">
                            <Markdown remarkPlugins={[remarkFrontmatter]}>
                              {_license.source}
                            </Markdown>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
        <NewsLetterSection />
      </Layout>
    </>
  );
}

export const getStaticProps = async () => {
  const mddb = await clientPromise;
  
  // Add debugging
  console.log("🔍 Checking mddb connection...");
  
  const licenseFiles = await mddb.getFiles({
    folder: "licenses",
  });
  
  console.log("📁 Found", licenseFiles.length, "license files");
  console.log("📄 Files:", JSON.stringify(licenseFiles.map(f => ({
    path: f.file_path,
    title: f.metadata?.title,
    category: f.metadata?.category
  })), null, 2));
  
  if (licenseFiles.length === 0) {
    console.error("❌ No license files found! Check:");
    console.error("   1. Files exist in md/licenses/");
    console.error("   2. Frontmatter has 'category' field");
    console.error("   3. .markdowndb/ cache was cleared");
  }
  
  const _licenseFiles = R.groupBy(
    licenseFiles.map((file) => {
      let source = fs.readFileSync(file.file_path, { encoding: "utf-8" });
      return {
        filePath: file.file_path,
        title: file.metadata?.title || "No title",
        category: file.metadata?.category || "other",
        source,
        metadata: file.metadata,
      };
    }),
    R.prop("category")
  );
  
  console.log("🗂️ Grouped categories:", Object.keys(_licenseFiles));
  console.log("📊 Files per category:", 
    Object.entries(_licenseFiles).map(([cat, files]) => `${cat}: ${files.length}`)
  );
  
  return {
    props: {
      licenseFiles: _licenseFiles,
    },
  };
};