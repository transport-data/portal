import { License } from "@interfaces/datapackage.interface";
import ReactSelect from "react-select";

export interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: Option[];
  onChange: (event?: string[]) => void;
  value?: string[];
}
export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  onChange,
  value,
}) => {
  const getValue = (value?: string[]) => {
    return value
      ? options.filter((option) => value.includes(option.value))
      : [];
  };
  return (
    <ReactSelect
      classNamePrefix="select"
      isMulti={true}
      classNames={{
        control: () =>
          "!rounded-md shadow-sm mt-1 dark:bg-slate-800 dark:border-slate-600 focus:",
        placeholder: () => "text-sm",
        option: () => `!text-primary hover:!bg-slate-100`,
        multiValue: () => `dark:bg-slate-900 dark:text-primary-dark`,
        multiValueLabel: () => `dark:bg-slate-900 dark:text-primary-dark`,
        multiValueRemove: () =>
          `dark:bg-slate-900 dark:text-primary-dark dark:hover:bg-red-900 dark:hover:text-red-200`,
      }}
      styles={{
        input: (base) => ({
          ...base,
          "input:focus": {
            boxShadow: "none",
          },
        }),
        control: (base, state) => ({
          ...base,
          "&:hover": { borderColor: "none" },
          boxShadow: state.isFocused ? "inset 0 0 0 2px rgb(87 83 78)" : "",
        }),
      }}
      options={options}
      value={getValue(value)}
      onChange={(newValue) => {
        onChange(newValue.map((val) => val.value));
      }}
    />
  );
};

export default MultiSelect;
