import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Controller,
  FieldValues,
  Path,
  PathValue,
  UseFormReturn,
  useForm,
} from "react-hook-form";
import { cn } from "@/lib/utils";
import { Socket } from "dgram";

export interface Option<V> {
  label: string;
  value: V;
  default?: boolean;
}

interface SimpleSelectProps<T extends FieldValues, V extends Object> {
  options: PathValue<T, Path<T> & Option<V>>[];
  placeholder: string;
  className?: string;
  maxWidth?: string;
  formObj?: UseFormReturn<T>;
  name: Path<T>;
  id?: string;
}

export default function SimpleSelect<T extends FieldValues, V extends Object>({
  options,
  placeholder,
  className,
  maxWidth = "xl:max-w-[28rem]",
  formObj,
  name,
  id,
  onChange: _onChange = (val) => {},
}: SimpleSelectProps<T, V> & { onChange?: (val: any) => void }) {
  const { control } = formObj ?? useForm();
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={
        options.find((option) => option.default)?.value ?? ''
      }
      render={({ field: { onChange: setSelected, value: selected } }) => {
        console.log(selected);
        return (
        <Select
          defaultValue={selected !== '' ? selected : undefined}
          onValueChange={(e) => {
            if (_onChange && e != null) {
              _onChange(e);
            }
            setSelected(e);
          }}
        >
          <SelectTrigger className={cn("w-full", maxWidth)}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        )
      }}
    />
  );
}
