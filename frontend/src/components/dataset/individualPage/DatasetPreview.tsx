import { DataExplorer } from "@components/data-explorer/DataExplorer";
import { Dataset } from "@portaljs/ckan";
import { useState } from "react";

export function DatasetPreview({ dataset }: { dataset: Dataset }) {
  const [currentResource, setCurrentResource] = useState(
    dataset.resources[0] ?? null
  );
  return (
    <div className="bg-gray-50 min-h-[500px]">
      <div className="container py-8">
        {currentResource && <DataExplorer resourceId={currentResource?.id} />}
      </div>
    </div>
  );
}
