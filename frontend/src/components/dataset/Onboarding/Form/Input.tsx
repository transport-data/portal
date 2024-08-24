import { inputStyle, labelClassName } from "@styles/formStyles";
import type { UseFormRegisterReturn } from "react-hook-form";

const Input: React.FC<{
  register: UseFormRegisterReturn<string>;
  label: string;
  defaultValue: string;
  disabled: boolean;
}> = ({ register, label, defaultValue, disabled }) => {
  return (
    <>
      <span className={labelClassName}>{label}</span>
      <input
        className={inputStyle}
        defaultValue={defaultValue}
        disabled={disabled}
        {...register}
      />
    </>
  );
};

export default Input;
