import Link, { type LinkProps } from "next/link";
import type { ResolvedVisualization } from "@/utils/fetchDatasetTags";

interface VisualizationGalleryProps {
  visualizations: ResolvedVisualization[];
  /** Extra props for the links that open each visualization. */
  linkProps?: Partial<LinkProps>;
  /** Set on dataset pages, so that closing the visualization returns to the dataset. */
  fromDataset?: boolean;
}

/** Grid of cards that each link to a visualization's showroom URL. */
export function VisualizationGallery({
  visualizations,
  linkProps,
  fromDataset,
}: VisualizationGalleryProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {visualizations.map((viz) => (
        <article
          key={viz.id}
          className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
        >
          <Link
            {...linkProps}
            // The address bar shows `as`, so the URL stays clean for sharing.
            href={`/showroom/${viz.id}${fromDataset ? "?from=dataset" : ""}`}
            as={`/showroom/${viz.id}`}
            className="block h-full"
          >
            {/* Thumbnail */}
            <div className="aspect-video relative w-full overflow-hidden bg-gray-100">
              {viz.thumbnailUrl ? (
                <img
                  src={viz.thumbnailUrl}
                  alt={`${viz.title} preview`}
                  loading="lazy"
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

              {/* Tags - Add type guard */}
              {viz.tags && Array.isArray(viz.tags) && viz.tags.length > 0 && (
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
          </Link>
        </article>
      ))}
    </div>
  );
}
