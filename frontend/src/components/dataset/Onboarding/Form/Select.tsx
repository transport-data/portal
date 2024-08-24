import { labelClassName, selectStyle } from "@styles/formStyles";
import type { UseFormRegisterReturn } from "react-hook-form";

const Select: React.FC<{
  register: UseFormRegisterReturn<string>;
  label: string;
  defaultValue?: string;
  placeHolder?: string;
  options: Array<{ value: string; label: string }>;
}> = ({ register, label, defaultValue, options, placeHolder }) => {
  return (
    <>
      <span className={labelClassName}>{label}</span>
      <select
        placeholder={placeHolder}
        className={selectStyle}
        defaultValue={defaultValue}
        {...register}
      >
        {options.map((option, index) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  );
};

export default Select;
