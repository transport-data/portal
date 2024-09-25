import classNames from "@utils/classnames";
import React from "react";

export const SelectableItemsList = ({
  title,
  items,
  selected,
  onSelectedItem,
}: {
  items: { value: string; icon: React.ReactNode; isSelected: boolean }[];
  title: string;
  selected?: string;
  onSelectedItem: (selectedItem: string) => void;
}) => {
  return (
    <div className="space-y-6">
      <h1 className="text-sm font-semibold">{title}</h1>
      <div className="flex flex-row flex-wrap items-center gap-3 whitespace-nowrap sm:flex-col sm:flex-nowrap sm:items-start">
        {items.map((x, i) => (
          <div
            key={`selectable-${i}`}
            onClick={() => onSelectedItem(x.value)}
            className={classNames(
              "flex cursor-pointer items-center gap-2 text-sm",
              selected === x.value ? "text-[#111928]" : "text-[#6B7280]"
            )}
          >
            <span>{x.icon}</span>
            <span>{x.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
