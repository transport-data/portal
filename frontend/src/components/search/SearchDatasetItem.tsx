import { CommandItem } from "@components/ui/command";
import {
  BuildingLibraryIcon,
  CheckCircleIcon,
  ClipboardIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
} from "@heroicons/react/20/solid";
import { DatabaseIcon } from "lucide-react";

export default function SearchDatasetItem({
  state,
  title,
  organization,
  metadata_modified,
  tags,
  description,
  region,
}: {
  state: string;
  title: string;
  organization: string;
  metadata_modified?: string;
  tags: Array<string>;
  description?: string;
  region?: string;
}) {
  return (
    <CommandItem className="flex gap-[12px] py-2">
      <DatasetBadge state={state} />
      <div>
        <h5 className="text-sm font-normal text-gray-700">{title}</h5>
        <div className="flex flex-col gap-[8px] text-xs font-medium text-gray-500 sm:flex-row">
          <div className="flex gap-[4px]">
            <BuildingLibraryIcon width={14} />
            {organization}
          </div>
          <span className="hidden sm:block">•</span>
          <div className="flex gap-[4px]">
            <ClipboardIcon width={14} />
            Updated on 23 March, 2023
          </div>
          <span className="hidden sm:block">•</span>
          <div className="flex gap-[4px]">
            <GlobeAltIcon width={14} />
            {region}
          </div>
        </div>
      </div>
    </CommandItem>
  );
}

const DatasetBadge = ({ state }: { state?: string }) => {
  const defaults =
    "flex items-center justify-center w-[32px] h-[32px] rounded-[8px]";
  return (
    <>
      {!state && (
        <span className={`${defaults} bg-purple-100 text-purple-600`}>
          <DatabaseIcon width={20} />
        </span>
      )}
      {state === "TDC Formatted" && (
        <span className={`${defaults} bg-green-100 text-green-600`}>
          <CheckCircleIcon width={20} />
        </span>
      )}

      {state === "TDC Harmonised" && (
        <span className={`${defaults} bg-yellow-100 text-yellow-600`}>
          <ShieldCheckIcon width={20} />
        </span>
      )}
    </>
  );
};
