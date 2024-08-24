import { ErrorMessage } from "@hookform/error-message";
import type { UseFormReturn } from "react-hook-form";
import { Controller } from "react-hook-form";
import { inputStyle } from "../../styles/formStyles";
import { api } from "@utils/api";
import MultiSelect from "@components/_shared/MultiSelect";
import { CustomSwitch } from "@components/_shared/CustomSwitch";
import type { OrganizationFormType } from "@schema/organization.schema";

export const GroupForm: React.FC<{
  formObj: UseFormReturn<OrganizationFormType>;
}> = ({ formObj }) => {
  const {
    register,
    formState: { errors },
    control,
  } = formObj;

  const { data: groups } = api.group.list.useQuery();

  const groupOptions = groups
    ? groups.map((group) => ({
        value: group.name,
        label: group.title,
      }))
    : [];

  return (
    <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-2">
      <div>
        <label
          htmlFor="name"
          className="block w-fit text-sm font-medium opacity-75"
        >
          Name
        </label>
        <div className="mt-1 w-full">
          <input type="text" className={inputStyle} {...register("name")} />
          <ErrorMessage
            errors={errors}
            name="name"
            render={({ message }) => (
              <p className="text-justify text-xs text-red-600">{message}</p>
            )}
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="title"
          className="block w-fit text-sm font-medium opacity-75"
        >
          Title
        </label>
        <div className="mt-1 w-full">
          <input type="text" className={inputStyle} {...register("title")} />
          <ErrorMessage
            errors={errors}
            name="title"
            render={({ message }) => (
              <p className="text-justify text-xs text-red-600">{message}</p>
            )}
          />
        </div>
      </div>{" "}
      <div className="sm:col-span-2">
        <label
          htmlFor="message"
          className="block text-sm font-medium opacity-75"
        >
          Description
        </label>
        <div className="mb-3 mt-1">
          <textarea
            id="description"
            rows={4}
            className={inputStyle}
            defaultValue={""}
            {...register("description")}
          />
        </div>
      </div>
    </div>
  );
};
