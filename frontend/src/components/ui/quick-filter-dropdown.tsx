import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Button } from "./button";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Facet } from "@components/_shared/DatasetsFilter";
import { Checkboxes, SearchPageOnChange } from "@pages/search";
import { SearchDatasetType } from "@schema/dataset.schema";
import React from "react";

export default function QuickFilterDropdown({
  text,
  items = [],
  filterFieldName,
  isCheckbox,
  searchFilter,
  defaultValue = "*",
  hideAllOption,
  onChange,
}: {
  text: string;
  hideAllOption?: boolean;
  isCheckbox?: boolean;
  filterFieldName: keyof SearchDatasetType;
  searchFilter: SearchDatasetType;
  onChange: SearchPageOnChange;
  items: Facet[];
  defaultValue?: string | string[];
}) {
  if (items.findIndex((x) => x.name === "all") > -1) {
    items.splice(
      items.findIndex((x) => x.name === "all"),
      1
    );
  }

  const selectedText =
    defaultValue === "*"
      ? "All"
      : typeof searchFilter[filterFieldName] === "object"
      ? (searchFilter[filterFieldName] as []).length > 1
        ? (searchFilter[filterFieldName] as []).length
        : (searchFilter[filterFieldName] as string[]).length === 1
        ? items.find(
            (x) => x.name === (searchFilter[filterFieldName] as string[])[0]
          )?.display_name
        : "All"
      : typeof searchFilter[filterFieldName] === "string"
      ? items.find((x) => x.name === searchFilter[filterFieldName])
          ?.display_name
      : "All";

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          id={`quick-filter-dropdown-button-${filterFieldName}`}
          size="sm"
          variant="input"
          className="flex items-center gap-1 rounded-[8px] shadow-none ring-[#E5E7EB] lg:w-fit"
        >
          <span className="text-sm font-normal text-gray-500">{text}: </span>
          <span className="text-sm font-medium text-gray-900">
            {selectedText}
          </span>
          <ChevronDownIcon width={16} className="ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="rounded-[8px] p-0">
        <DropdownMenuLabel className="px-4 py-[12px]">{text}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isCheckbox ? (
          <div
            onClick={() => onChange([{ value: [], key: filterFieldName }])}
            className="ml-auto flex cursor-pointer justify-end px-4 pt-2 text-sm font-semibold text-[#006064]"
          >
            Clear filter
          </div>
        ) : (
          <></>
        )}
        <div className="p-4">
          {isCheckbox ? (
            <Checkboxes
              onChange={(items) =>
                onChange([{ value: items, key: filterFieldName }])
              }
              items={items}
              selectedItems={(searchFilter[filterFieldName] as []) || []}
              limitToPresentViewAll={7}
            />
          ) : (
            <RadioGroup
              defaultValue={defaultValue as string}
              className="flex flex-col gap-[12px]"
              onValueChange={(items) =>
                onChange([{ value: items, key: filterFieldName }])
              }
            >
              {!hideAllOption && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="*"
                    id="option-one"
                    className="border-gray-300 text-accent data-[state=checked]:border-accent"
                    onSelect={(e) => {
                      console.log(e);
                    }}
                  />
                  <Label
                    htmlFor="option-one"
                    className="text-sm font-medium leading-none text-gray-500"
                  >
                    All
                  </Label>
                </div>
              )}

              {items.map((item, i) => (
                <div
                  className="flex items-center space-x-2"
                  key={`${item.display_name}-${i}`}
                >
                  <RadioGroupItem
                    id={`quick-filter-dropdown-${filterFieldName}-item-${item.name}`}
                    className="border-gray-300 text-accent data-[state=checked]:border-accent"
                    value={item.name}
                  />
                  <Label
                    htmlFor={`${item.display_name}-${i}`}
                    className="text-sm font-medium leading-none text-gray-500"
                  >
                    {item.display_name}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
