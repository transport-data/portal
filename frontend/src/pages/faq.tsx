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
import { useRouter } from "next/router";
import { cn } from "@lib/utils";
import useHash from "@lib/useHash";
import { DefaultBreadCrumb } from "@components/ui/breadcrumb";
import { ChevronLeftIcon } from "lucide-react";
import NewsLetterSection from "@components/_shared/NewsletterSection";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@components/_shared/ContactForm";

const categories = {
  getting_started: { title: "Getting Started" },
  organizations: { title: "Organisations" },
  submitting_data: { title: "Submitting Data" },
  sharing_data: { title: "Sharing and Using Data" },
  geodata: { title: "Geodata" },
  search: { title: "Search" },
  metadata: { title: "Metadata and Data Quality" },
  devs: { title: "Resources for Developers" },
  sensitive_data: { title: "Sensitive Data" },
  licenses: { title: "Data Licenses" },
};

const breadcrumbs = [
  {
    href: `/`,
    label: "Home",
  },
  {
    href: `/faq`,
    label: `Help & FAQs`,
  },
];

export default function Faq({
  faqFiles,
}: {
  faqFiles: Record<string, MddbFile[]>;
}) {
  const hash = useHash();
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
          <div className="mt-6 pb-8 md:flex md:items-center md:justify-between">
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:tracking-tight">
                Help & FAQs
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="container grid pb-8 lg:grid-cols-7 xl:gap-x-12">
        <div className="lg:col-span-2">
          <div className="inline-flex w-full flex-col items-start justify-start gap-6 rounded-lg border border-gray-200 bg-gray-50 p-4 lg:max-w-fit lg:p-6 xl:p-8">
            <div className="text-base font-bold leading-normal text-primary">
              Help & FAQs
            </div>
            <div className="flex flex-col items-start justify-start gap-4">
              {R.entries(categories).map((category) => (
                <a
                  href={`#${category[0]}`}
                  className={cn(
                    "text-sm font-medium leading-normal text-gray-500",
                    hash && hash.includes(`${category[0]}`) && "text-accent"
                  )}
                >
                  {category[1].title}
                </a>
              ))}
            </div>
            <Button asChild><a href="https://portal.transport-data.org/contact" target="_blank">Further questions? Contact us!</a></Button>
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="shrink grow basis-0 pb-4 text-2xl font-bold leading-9 text-primary">
            About Transport Data Commons
          </div>
          <div className="prose prose-p:mt-2 prose-p:text-base prose-p:text-gray-500 prose-a:text-accent prose-a:no-underline prose-ul:mt-2 prose-li:m-0 prose-li:text-base prose-li:text-gray-500">
            <Markdown remarkPlugins={[remarkFrontmatter]}>
              {
                // @ts-ignore
                faqFiles["intro"][0]["source"]
              }
            </Markdown>
          </div>
          {R.entries(categories).map((category, index) => {
            const [_category, categoryMetadata] = category;
            let _faqs = faqFiles[_category as keyof typeof categories] || [];
            _faqs = R.sortBy(_faqs, R.prop('filePath'));
            return (
              <div className="py-4">
                <div
                  id={_category}
                  className="shrink grow basis-0 pb-2 text-2xl font-bold leading-9 text-primary"
                >
                  {categoryMetadata.title}
                </div>
                {_faqs.map((_faq, index) => (
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="border-b border-gray-200 py-4">
                        {_faq.title}
                      </AccordionTrigger>
                      <AccordionContent className="py-4">
                        <div className="prose text-justify marker:text-accent prose-p:mt-2 prose-p:text-gray-500 prose-a:text-accent prose-ul:mt-2 prose-li:m-0">
                          <Markdown remarkPlugins={[remarkFrontmatter]}>
                            {_faq.source}
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
  );
}

export const getStaticProps = async () => {
  const mddb = await clientPromise;
  // get all files that are not marked as draft in the frontmatter
  const faqFiles = await mddb.getFiles({
    folder: "faq",
  });
  const _faqFiles = R.groupBy(
    faqFiles.map((file) => {
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
      faqFiles: _faqFiles,
    },
  };
};
