import Layout from "@components/_shared/Layout";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { NextSeo } from "next-seo";
import {
  VISUALIZATIONS,
  validateVisualizations,
} from "@/config/visualizations";
import type { GetStaticPaths, GetStaticProps } from "next";
import { DefaultBreadCrumb } from "@components/ui/breadcrumb";
import { ChevronLeftIcon, X } from "lucide-react";
import NewsLetterSection from "@components/_shared/NewsletterSection";
import { VisualizationGallery } from "@components/showroom/VisualizationGallery";
import { VisualizationModal } from "@components/showroom/VisualizationModal";
import {
  getResolvedVisualizations,
  type ResolvedVisualization,
} from "@/utils/fetchDatasetTags";

// Social link previews need absolute URLs.
const PORTAL_URL = "https://portal.transport-data.org";

const breadcrumbs = [
  {
    href: `/`,
    label: "Home",
  },
  {
    href: `/showroom`,
    label: `Showroom`,
  },
];

interface ShowroomProps {
  visualizations: ResolvedVisualization[];
}

// One page file serves /showroom and /showroom/<id>, which is what lets opening
// and closing a visualization change the URL without reloading the page.
export const getStaticPaths: GetStaticPaths = () => {
  validateVisualizations(VISUALIZATIONS);

  return {
    paths: [
      { params: { id: [] } },
      ...VISUALIZATIONS.map((viz) => ({ params: { id: [viz.id] } })),
    ],
    // Unknown ids reach getStaticProps, which redirects them to the gallery.
    fallback: "blocking",
  };
};

// Every URL gets the whole gallery, as it sits behind the modal.
export const getStaticProps: GetStaticProps<ShowroomProps> = async ({
  params,
}) => {
  const id = params?.id as string[] | undefined;

  // Printed links and QR codes outlive config changes, so send old ones to the
  // gallery, which explains what happened, rather than to a generic 404.
  if (
    id &&
    (id.length > 1 || !VISUALIZATIONS.some((viz) => viz.id === id[0]))
  ) {
    return {
      redirect: { destination: "/showroom?missing=1", permanent: false },
    };
  }

  return {
    props: {
      visualizations: await getResolvedVisualizations(),
    },
    revalidate: 3600, // Revalidate every hour (ISR - Incremental Static Regeneration)
  };
};

export default function ShowroomPage({ visualizations }: ShowroomProps) {
  const router = useRouter();
  const selectedId = router.query.id?.[0];
  const selected = visualizations.find((viz) => viz.id === selectedId);

  // Whether closing the modal should return to the previous page: true after clicking
  // a card, here or on a dataset page. `from` is only in the query at first render
  // after an in-app navigation, so a typed or shared URL with it has no effect.
  const closeGoesBack = useRef(router.query.from === "dataset");

  // Shown until dismissed, as the URL is cleaned up straight away.
  const [showMissingNotice, setShowMissingNotice] = useState(false);

  useEffect(() => {
    if (!router.query.missing) return;

    setShowMissingNotice(true);
    void router.replace("/showroom", undefined, {
      shallow: true,
      scroll: false,
    });
  }, [router]);

  // Next treats going back to the entry from the initial page load as a full page
  // change and scrolls to the top, so keep moves between showroom URLs shallow.
  useEffect(() => {
    router.beforePopState(({ as }) => {
      if (!/^\/showroom(\/|\?|#|$)/.test(as)) return true;

      void router.replace(as, undefined, { shallow: true, scroll: false });
      return false;
    });

    return () => router.beforePopState(() => true);
  }, [router]);

  const closeModal = () => {
    if (closeGoesBack.current) {
      closeGoesBack.current = false;
      void router.back();
    } else {
      void router.replace("/showroom", undefined, {
        shallow: true,
        scroll: false,
      });
    }
  };

  const pageUrl = `${PORTAL_URL}/showroom${selected ? `/${selected.id}` : ""}`;
  const title = selected?.title ?? "Showroom";
  const description =
    selected?.description ??
    "Gallery of interactive dashboards and visualizations built with Transport Data Commons datasets";

  return (
    <>
      <NextSeo
        title={title}
        description={description}
        canonical={pageUrl}
        openGraph={{
          type: "website",
          url: pageUrl,
          title,
          description,
          siteName: "Transport Data Commons",
          images: selected?.thumbnailUrl
            ? [
                {
                  url: new URL(selected.thumbnailUrl, PORTAL_URL).toString(),
                  alt: `${selected.title} preview`,
                },
              ]
            : [],
        }}
        twitter={{ cardType: "summary_large_image" }}
      />
      <Layout backgroundEffect effectSize="1.5%">
        <div className="w-full">
          <div className="container py-8">
            <div>
              <nav aria-label="Back" className="sm:hidden">
                {/* A real link, as visitors arriving from a QR code have no history to go back to */}
                <Link
                  href="/"
                  className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  <ChevronLeftIcon
                    aria-hidden="true"
                    className="-ml-1 mr-1 h-3.5 w-3.5 flex-shrink-0 text-gray-400"
                  />
                  Home
                </Link>
              </nav>
              <nav aria-label="Breadcrumb" className="hidden sm:flex">
                <DefaultBreadCrumb links={breadcrumbs} />
              </nav>
            </div>
            <div className="mt-6 pb-8 md:flex md:items-center md:justify-between">
              <div className="min-w-0 flex-1">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:tracking-tight">
                  TDC Showroom
                </h2>
                <p className="mt-2 text-base text-gray-500">
                  A curated gallery of dashboards and visualizations built with
                  Transport Data Commons data. Click any visualization to
                  interact with it, or explore the datasets used to create them.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container pb-8">
          {showMissingNotice && (
            <div
              role="status"
              className="mb-6 flex items-start justify-between gap-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
            >
              <p>
                We couldn&apos;t find that visualisation. It may have been moved
                or removed, but you can browse the others below.
              </p>
              <button
                type="button"
                aria-label="Dismiss"
                onClick={() => setShowMissingNotice(false)}
                className="flex-shrink-0 rounded-md text-amber-700 hover:text-amber-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
          {visualizations.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
              <p className="text-gray-500">
                No visualizations available yet. Check back soon!
              </p>
            </div>
          ) : (
            <VisualizationGallery
              visualizations={visualizations}
              linkProps={{
                shallow: true,
                scroll: false,
                prefetch: false,
                onClick: () => {
                  closeGoesBack.current = true;
                },
              }}
            />
          )}
        </div>

        {selected && (
          <VisualizationModal
            key={selected.id}
            viz={selected}
            onClose={closeModal}
          />
        )}

        <NewsLetterSection />
      </Layout>
    </>
  );
}
