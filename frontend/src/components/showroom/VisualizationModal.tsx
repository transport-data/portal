import * as Dialog from "@radix-ui/react-dialog";
import { ExternalLink, X } from "lucide-react";
import { EmbedFrame } from "@components/showroom/EmbedFrame";
import type { ResolvedVisualization } from "@/utils/fetchDatasetTags";

interface VisualizationModalProps {
  viz: ResolvedVisualization;
  onClose: () => void;
}

/** Full screen on phones, and a large centred panel on bigger screens. */
export function VisualizationModal({ viz, onClose }: VisualizationModalProps) {
  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      {/* No portal, as portals don't render on the server and visitors arriving at
          the item's URL would see the gallery alone until the page's scripts load */}
      <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70" />
      <Dialog.Content className="fixed inset-0 z-50 flex flex-col bg-white focus:outline-none sm:inset-auto sm:left-1/2 sm:top-1/2 sm:h-[95vh] sm:w-[95vw] sm:max-w-[1600px] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-lg sm:shadow-2xl">
        <div className="flex-shrink-0 border-b border-gray-200 bg-white px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-start justify-between">
            <Dialog.Title className="min-w-0 flex-1 pr-4 text-lg font-bold text-gray-900 sm:truncate md:text-xl">
              {viz.title}
            </Dialog.Title>
            <Dialog.Close
              aria-label="Close"
              className="flex-shrink-0 rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-500 md:p-2"
            >
              <X className="h-5 w-5 md:h-6 md:w-6" />
            </Dialog.Close>
          </div>

          {/* Phones only, as visitors arriving from a QR code have no other context */}
          <Dialog.Description className="mt-1 line-clamp-3 text-sm text-gray-500 sm:hidden">
            {viz.description}
          </Dialog.Description>

          <div className="mt-2 flex flex-wrap items-center gap-2 md:mt-3 md:gap-3">
            {viz.tags && viz.tags.length > 0 && (
              <div className="hidden flex-wrap gap-1.5 sm:flex">
                {viz.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <a
              href={viz.externalLink ?? viz.embedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center whitespace-nowrap text-xs text-accent hover:underline md:text-sm"
            >
              <ExternalLink className="mr-1 h-3 w-3 md:h-4 md:w-4" />
              Open in new tab
            </a>
          </div>
        </div>

        <div className="min-h-0 flex-1 bg-gray-50">
          <EmbedFrame
            src={viz.embedUrl}
            title={viz.title}
            responsive={viz.responsive}
          />
        </div>

        <div className="max-h-24 flex-shrink-0 overflow-auto border-t border-gray-200 bg-gray-50 px-4 py-3 md:max-h-none md:px-6 md:py-4">
          <h4 className="text-xs font-bold text-gray-900 md:text-sm">
            Datasets used:
          </h4>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 md:mt-2">
            {viz.datasets.map((ds, idx) => (
              <a
                key={`${ds.url}-${idx}`}
                href={ds.url}
                className="text-xs text-accent hover:underline md:text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                {ds.title}
              </a>
            ))}
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}
