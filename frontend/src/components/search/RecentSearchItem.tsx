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

export default function SearchDatasetItem({}) {
  return (
    <CommandItem asChild className="group flex gap-[12px] py-2">
      <Link href={``}>
        <SearchFacetItem
          text={"passanger activity"}
          icon={<VariableIcon width={20} className="text-gray-500" />}
          context={"Indicator"}
        />
        <SearchFacetItem
          badge={"in: Asia"}
          text={"passenger transport activity"}
        />
        <SearchFacetItem text={"heavy duty vehicles"} />
        <SearchFacetItem text={"passenger vehicles"} />
      </Link>
    </CommandItem>
  );
}
