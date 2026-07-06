import { Dataset } from "@portaljs/ckan";
import DatasetCard from "@/components/_shared/DatasetCard";

interface DatasetListProps {
  datasets: Array<Dataset>;
}
export default function DatasetList({ datasets }: DatasetListProps) {
  return (
    <div className="flex w-full flex-col gap-y-4 py-8">
      {datasets.map((dataset: Dataset) => (
        <DatasetCard key={dataset.id} dataset={dataset} showOrg={false} />
      ))}
    </div>
  );
}
