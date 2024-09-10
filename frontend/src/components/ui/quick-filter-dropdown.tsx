import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";

export default function QuickFilterDropdown({
  text,
  items,
  defaultValue,
  children,
}: {
  text: string;
  items: Array<{ text: string; value: string }>;
  defaultValue?: string;
  children?: React.ReactNode;
}) {
  const [selected, setSelected] = useState<string>(defaultValue || "*");
  const selectedText =
    selected === "*" ? "All" : items.find((i) => i.value === selected)?.text;

  useEffect(() => {
    if (defaultValue) setSelected(defaultValue);
  }, [defaultValue]);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="input"
          className="flex items-center gap-1 rounded-[8px] shadow-none ring-[#E5E7EB]"
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
          <RadioGroup
            defaultValue={selected}
            className="flex flex-col gap-[12px]"
            onValueChange={(v) => setSelected(v)}
          >
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
            {items.map((item, i) => (
              <div
                className="flex items-center space-x-2"
                key={`${item.text}-${i}`}
              >
                <RadioGroupItem
                  className="border-gray-300 text-accent data-[state=checked]:border-accent"
                  value={item.value}
                  id={`${item.text}-${i}`}
                />
                <Label
                  htmlFor={`${item.text}-${i}`}
                  className="text-sm font-medium leading-none text-gray-500"
                >
                  {item.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
          {/*items.map((item, i) => (
            <DropdownMenuItem key={`item-${i}`}>loj</DropdownMenuItem>
          ))*/}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
