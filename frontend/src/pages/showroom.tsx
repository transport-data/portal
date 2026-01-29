import Layout from "@components/_shared/Layout";
import Head from "next/head";
import { VISUALIZATIONS } from "@/config/visualizations";
import type { GetStaticProps } from "next";
import { DefaultBreadCrumb } from "@components/ui/breadcrumb";
import { ChevronLeftIcon, ExternalLink } from "lucide-react";
import NewsLetterSection from "@components/_shared/NewsletterSection";
import { useState } from "react";

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

// This will pre-render the page at build time, avoiding the dynamic route conflict
export const getStaticProps: GetStaticProps = async () => {
    // Validate visualizations at build time
    for (const viz of VISUALIZATIONS) {
        if (!viz.datasets || viz.datasets.length < 1) {
            throw new Error(
                `Visualization "${viz.id}" must reference at least one dataset in config.`
            );
        }
    }

    return {
        props: {},
    };
};

export default function ShowroomPage() {
    const [selectedViz, setSelectedViz] = useState<string | null>(null);

    const selectedVisualization = VISUALIZATIONS.find(
        (viz) => viz.id === selectedViz
    );

    return (
        <>
            <Head>
                <title>Showroom</title>
                <meta
                    name="description"
                    content="Gallery of interactive dashboards and visualizations built with Transport Data Commons datasets"
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
                    {VISUALIZATIONS.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                            <p className="text-gray-500">
                                No visualizations available yet. Check back soon!
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {VISUALIZATIONS.map((viz) => (
                                <article
                                    key={viz.id}
                                    className="group cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
                                    onClick={() => setSelectedViz(viz.id)}
                                >
                                    {/* Thumbnail */}
                                    <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                                        {viz.thumbnailUrl ? (
                                            <img
                                                src={viz.thumbnailUrl}
                                                alt={`${viz.title} preview`}
                                                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                                <div className="text-center text-gray-400">
                                                    <svg
                                                        className="mx-auto h-12 w-12"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={1}
                                                            d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                                                        />
                                                    </svg>
                                                    <p className="mt-2 text-sm">Dashboard Preview</p>
                                                </div>
                                            </div>
                                        )}
                                        {/* Overlay on hover */}
                                        <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
                                    </div>

                                    {/* Content */}
                                    <div className="p-4">
                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary">
                                            {viz.title}
                                        </h3>
                                        <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                                            {viz.description}
                                        </p>

                                        {/* Tags */}
                                        {viz.tags && viz.tags.length > 0 && (
                                            <div className="mt-3 flex flex-wrap gap-1.5">
                                                {viz.tags.slice(0, 3).map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                                {viz.tags.length > 3 && (
                                                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                                                        +{viz.tags.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {/* Datasets count */}
                                        <div className="mt-3 flex items-center text-sm text-gray-500">
                                            <svg
                                                className="mr-1.5 h-4 w-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                                                />
                                            </svg>
                                            {viz.datasets.length}{" "}
                                            {viz.datasets.length === 1 ? "dataset" : "datasets"}
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>

                {/* Modal for expanded view */}
                {selectedVisualization && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-0"
                        onClick={() => setSelectedViz(null)}
                    >
                        {/* Modal container - fixed size, no overflow */}
                        <div
                            className="relative flex flex-col bg-white rounded-lg shadow-2xl"
                            style={{
                                width: "95vw",
                                height: "95vh",
                                maxWidth: "1600px",
                                maxHeight: "95vh"
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header - Fixed height */}
                            <div className="flex-shrink-0 border-b border-gray-200 bg-white px-4 py-3 md:px-6 md:py-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0 pr-4">
                                        <h3 className="text-lg md:text-xl font-bold text-gray-900 truncate">
                                            {selectedVisualization.title}
                                        </h3>
                                        <p className="mt-1 text-xs md:text-sm text-gray-500 line-clamp-2">
                                            {selectedVisualization.description}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedViz(null)}
                                        className="flex-shrink-0 rounded-md p-1.5 md:p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                                    >
                                        <svg
                                            className="h-5 w-5 md:h-6 md:w-6"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                </div>

                                {/* Tags and external link */}
                                <div className="mt-2 md:mt-3 flex flex-wrap items-center gap-2 md:gap-3">
                                    {selectedVisualization.tags && selectedVisualization.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5">
                                            {selectedVisualization.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    {selectedVisualization.externalLink && (
                                        <a
                                            href={selectedVisualization.externalLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center text-xs md:text-sm text-accent hover:underline whitespace-nowrap"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <ExternalLink className="mr-1 h-3 w-3 md:h-4 md:w-4" />
                                            Open in new tab
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Modal Body - Flexible iframe container (NO SCROLLBAR) */}
                            <div className="flex-1 bg-gray-50 overflow-hidden">
                                <iframe
                                    src={selectedVisualization.embedUrl}
                                    title={selectedVisualization.title}
                                    className="w-full h-full border-0"
                                    allowFullScreen
                                    referrerPolicy="no-referrer"
                                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                                />
                            </div>

                            {/* Modal Footer - Fixed height */}
                            <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50 px-4 py-3 md:px-6 md:py-4">
                                <h4 className="text-xs md:text-sm font-bold text-gray-900">
                                    Datasets used:
                                </h4>
                                <div className="mt-1 md:mt-2 flex flex-wrap gap-x-4 gap-y-1">
                                    {selectedVisualization.datasets.map((ds, idx) => (
                                        <a
                                            key={`${selectedVisualization.id}-${ds.url}-${idx}`}
                                            href={ds.url}
                                            className="text-xs md:text-sm text-accent hover:underline"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {ds.title}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <NewsLetterSection />
            </Layout>
        </>
    );
}