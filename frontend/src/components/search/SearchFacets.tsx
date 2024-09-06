import { CommandGroup, CommandItem } from "@components/ui/command";
import SearchDropdownHeader from "./SearchDropdownHeader";
import SearchNarrowItem from "./SearchFacetItem";
import { useState } from "react";

export default function SearchFacets({
  facets,
  showAll,
  headerAction,
  onSelect,
}: {
  facets: any;
  showAll: boolean;
  headerAction: Function;
  onSelect?: Function;
}) {
  const [items, setItems] = useState(facets);
  const entries: Array<any> = Object.entries(items);
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
            badge={`${facetName}:`}
            text={facet.description}
            onSelect={() => {
              onSelect && onSelect(facetName);
              //onSelect();
            }}
          />
        ))}
    </CommandGroup>
  );
}
