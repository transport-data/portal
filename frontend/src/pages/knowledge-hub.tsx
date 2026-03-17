import Layout from "@components/_shared/Layout";
import Head from "next/head";
import type { GetStaticProps } from "next";
import { useMemo, useState } from "react";
import { ChevronLeftIcon } from "lucide-react";
import { DefaultBreadCrumb } from "@components/ui/breadcrumb";
import NewsLetterSection from "@components/_shared/NewsletterSection";

import { KNOWLEDGE_ITEMS, type KnowledgeItem } from "@/config/knowledge";

const breadcrumbs = [
  { href: "/", label: "Home" },
  { href: "/knowledge-hub", label: "Knowledge Hub" },
];

interface KnowledgeHubProps {
  items: KnowledgeItem[];
}

export const getStaticProps: GetStaticProps<KnowledgeHubProps> = async () => {
  return {
    props: { items: KNOWLEDGE_ITEMS },
    revalidate: 3600,
  };
};

export default function KnowledgeHubPage({ items }: KnowledgeHubProps) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

  const selectedDoc = items.find((i) => i.id === selectedDocId);

  const allTags = useMemo(() => {
    const s = new Set<string>();
    items.forEach((item) => {
      if (Array.isArray(item.tags)) item.tags.forEach((t) => s.add(t));
    });
    return Array.from(s).sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();

    return items.filter((item) => {
      const matchQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (Array.isArray(item.tags) && item.tags.join(" ").toLowerCase().includes(q));

      const matchTag =
        !activeTag || (Array.isArray(item.tags) && item.tags.includes(activeTag));

      return matchQuery && matchTag;
    });
  }, [items, query, activeTag]);

  return (
    <>
      <Head>
        <title>TDC Knowledge Hub</title>
        <meta
          name="description"
          content="Guidance and knowledge material from Transport Data Commons."
        />
        <link rel="icon" href="/favicon.ico" />
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
                  TDC Knowledge Hub
                </h2>
                <p className="mt-2 text-base text-gray-500">
                  Guidance notes and knowledge material to support transport data
                  collection, analysis, and reporting.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search knowledge material..."
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTag(null)}
                  className={`rounded-full px-3 py-1 text-sm ${
                    activeTag === null
                      ? "bg-[#006064] text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  All
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setActiveTag(tag)}
                    className={`rounded-full px-3 py-1 text-sm ${
                      activeTag === tag
                        ? "bg-[#006064] text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="container pb-8">
          {filteredItems.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
              <p className="text-gray-500">No knowledge material found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <article
                  key={item.id}
                  className="group cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
                  onClick={() => setSelectedDocId(item.id)}
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.imageUrl}
                        alt={`${item.title} preview`}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <p className="text-sm text-gray-500">PDF Preview</p>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary">
                      {item.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                      {item.description}
                    </p>

                    {Array.isArray(item.tags) && item.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {item.tags.slice(0, 3).map((tag) => (
                          <span
                            key={`${item.id}-${tag}`}
                            className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700"
                          >
                            {tag}
                          </span>
                        ))}
                        {item.tags.length > 3 && (
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                            +{item.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="mt-3 text-sm text-gray-500">
                      {item.datasets?.length ?? 0} related{" "}
                      {(item.datasets?.length ?? 0) === 1 ? "dataset" : "datasets"}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {selectedDoc && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-0"
            onClick={() => setSelectedDocId(null)}
          >
            <div
              className="relative flex flex-col rounded-lg bg-white shadow-2xl"
              style={{ width: "95vw", height: "95vh", maxWidth: "1400px", maxHeight: "95vh" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex-shrink-0 border-b border-gray-200 bg-white px-4 py-3 md:px-6 md:py-4">
                <div className="flex items-start justify-between">
                  <h3 className="pr-4 text-lg font-bold text-gray-900 md:text-xl">
                    {selectedDoc.title}
                  </h3>
                  <button
                    onClick={() => setSelectedDocId(null)}
                    className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-hidden bg-gray-50">
                <iframe
                  src={`${selectedDoc.pdfUrl}#view=FitH`}
                  title={selectedDoc.title}
                  className="h-full w-full border-0"
                />
              </div>

              <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50 px-4 py-3 md:px-6 md:py-4">
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={selectedDoc.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-white hover:bg-accent/90 md:text-sm"
                  >
                    Open in new tab
                  </a>
                  <a
                    href={selectedDoc.pdfUrl}
                    download
                    className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 md:text-sm"
                  >
                    Download PDF
                  </a>
                </div>

                {selectedDoc.datasets && selectedDoc.datasets.length > 0 && (
                  <div className="mt-3">
                    <h4 className="text-xs font-bold text-gray-900 md:text-sm">
                      Related datasets:
                    </h4>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                      {selectedDoc.datasets.map((ds, idx) => (
                        <a
                          key={`${selectedDoc.id}-${idx}-${ds.url}`}
                          href={ds.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-accent hover:underline md:text-sm"
                        >
                          {ds.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <NewsLetterSection />
      </Layout>
    </>
  );
}