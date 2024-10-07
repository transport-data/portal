import DatasetBadge from "@components/dataset/DatasetBadge";
import { Badge } from "@components/ui/badge";
import { CommandItem } from "@components/ui/command";
import {
  BuildingLibraryIcon,
  CheckCircleIcon,
  CircleStackIcon,
  ClipboardIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
} from "@heroicons/react/20/solid";
import { Dataset } from "@interfaces/ckan/dataset.interface";
import { formatDate } from "@lib/utils";
import Link from "next/link";

export default function SearchDatasetItem({
  name,
  title,
  organization,
  owner_org,
  tdc_category,
  metadata_modified,
  regions,
  groups,
  notes,
  modes,
}: Dataset) {
  return (
    <CommandItem
      asChild
      className="group flex gap-[12px] py-2"
      value={`${title} ${notes}`}
    >
      <Link href={`/@${organization?.name}/${name}`}>
        <DatasetBadge tdc_category={tdc_category} />
        <div>
          <h5 className="text-sm font-normal text-gray-700 group-hover:text-white">
            {title}
          </h5>
          <div className="flex flex-col gap-[8px] text-xs font-medium text-gray-500 group-hover:text-slate-300 sm:flex-row">
            <div className="flex gap-[4px]">
              <BuildingLibraryIcon width={14} />
              {organization?.title}
            </div>
            <span className="hidden sm:block">•</span>
            <div className="flex gap-[4px]">
              <ClipboardIcon width={14} />
              Updated on {formatDate(metadata_modified ?? "")}
            </div>

            {regions && regions.length && (
              <>
                <span className="hidden sm:block">•</span>
                <div className="flex gap-[4px]">
                  <GlobeAltIcon width={14} />
                  {regions?.map((r, idx) => (
                    <span key={`group-${r}`}>
                      {groups?.find((g) => g.name === r)?.display_name}
                      {idx < regions.length - 1 && ","}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </Link>
    </CommandItem>
  );
}
