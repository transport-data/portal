import { DataExplorer } from "@components/data-explorer/DataExplorer";
import { Dataset } from "@portaljs/ckan";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { FormLabel } from "@components/ui/form";
import { Label } from "@components/ui/label";

export function DatasetPreview({ dataset }: { dataset: Dataset }) {
  const [currentResource, setCurrentResource] = useState(
    dataset.resources[1]?.id ?? ""
  );
  return (
    <div className="min-h-[500px] bg-gray-50">
      <div className="container py-8">
        <div className="flex w-full">
          <div>
            <Label>Resource</Label>
            <Select
              onValueChange={setCurrentResource}
              defaultValue={currentResource}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Resource" />
              </SelectTrigger>
              <SelectContent>
                {dataset.resources.map((resource) => (
                  <SelectItem key={resource.id} value={resource.id}>
                    {resource.name ?? resource.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="py-4">
        {currentResource && <DataExplorer resourceId={currentResource} />}
        </div>
      </div>
    </div>
  );
}
