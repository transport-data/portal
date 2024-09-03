import { CommandGroup, CommandItem } from "@components/ui/command";
import SearchDropdownHeader from "./SearchDropdownHeader";
import SearchNarrowItem from "./SearchFacetItem";

export const facets: any = {
  in: {
    description: "a region, country or a city",
  },
  after: {
    description: "referencing data after a date",
  },
  before: {
    description: "referencing data before a date",
  },
  sector: {
    description: "road, rail, aviation, water transportation",
  },
  mode: {
    description: "car, 2W, 3W, multi-modal etc.",
  },
  service: {
    description: "passenger or freight",
  },
  fuel: {
    description: "battery electric, petrol, diesel etc.",
  },
};

export default function SearchFacets({
  showAll,
  headerAction,
  onSelect,
}: {
  showAll: boolean;
  headerAction: Function;
  onSelect?: Function;
}) {
  const entries: Array<any> = Object.entries(facets);
  return (
    <CommandGroup
      heading={
        <SearchDropdownHeader title="Narrow your search">
          <span
            className="pointer w-fit cursor-pointer text-sm font-semibold text-cyan-600"
            onClick={() => headerAction()}
          >
            {showAll ? "Show less" : "Show all"}
          </span>
        </SearchDropdownHeader>
      }
    >
      {entries
        .slice(0, showAll ? entries.length : 4)
        .map(([facetName, facet]) => (
          <SearchNarrowItem
            key={facetName}
            badge={facetName}
            text={facet.description}
            onSelect={onSelect}
          />
        ))}
    </CommandGroup>
  );
}
