import classNames from "@utils/classnames";
import React from "react";

export const SelectableItemsList = ({
  title,
  items,
  selected,
  onSelectedItem,
}: {
  items: {
    text?: string;
    value: string;
    icon: React.ReactNode;
    isSelected: boolean;
  }[];
  title: string;
  selected?: string;
  onSelectedItem: (selectedItem: string) => void;
}) => {
  return (
    <div className="selectable-items-list space-y-6">
      <h1 className="text-sm font-semibold">{title}</h1>
      <div className="flex flex-row flex-wrap items-center gap-3 overflow-hidden whitespace-nowrap sm:flex-col  sm:flex-nowrap sm:items-start">
        {items.map((x, i) => (
          <div
            key={`selectable-${i}`}
            onClick={() => onSelectedItem(x.value)}
            className={classNames(
              "flex max-w-full cursor-pointer items-center gap-2  text-sm text-sm",
              selected === x.value
                ? "font-medium text-[#111928]"
                : "text-[#6B7280]"
            )}
          >
            <span>{x.icon}</span>
            <span className=" overflow-hidden truncate whitespace-nowrap">
              {x.text || x.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
