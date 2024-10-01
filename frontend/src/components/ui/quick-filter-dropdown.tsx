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
  defaultValue?: string;
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
      : items.find((i) => i.name === defaultValue)?.display_name;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="input"
          className="flex items-center lg:w-fit gap-1 rounded-[8px] shadow-none ring-[#E5E7EB]"
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
        <div className="p-4">
          {isCheckbox ? (
            <Checkboxes
              onChange={(items) =>
                onChange([{ value: items, key: filterFieldName }])
              }
              items={items}
              selectedItems={searchFilter.regions}
              limitToPresentViewAll={7}
            />
          ) : (
            <RadioGroup
              defaultValue={defaultValue}
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
                    className="border-gray-300 text-accent data-[state=checked]:border-accent"
                    value={item.name}
                    id={`${item.display_name}-${i}`}
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
