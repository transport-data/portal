import { DataExplorer } from "@components/pivot-data-explorer/DataExplorer";
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
import { Dataset } from "@interfaces/ckan/dataset.interface";

export function DatasetPreview({ dataset }: { dataset: Dataset }) {
  const resources = dataset.resources.filter((r) => !!r.datastore_active);
  const [currentResource, setCurrentResource] = useState(
    resources[0]?.id ?? ""
  );
  if (dataset.tdc_category === "tdc_harmonized") {
    return (
      <div className="min-h-[500px] hard-gradient-gray-to-white flex flex-col">
        <div className="h-full grow flex flex-col">
          {currentResource && <DataExplorer resourceId={currentResource} />}
        </div>
      </div>
    );
  }
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
                {resources.map((resource) => (
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
