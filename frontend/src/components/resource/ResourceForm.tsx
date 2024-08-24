import { ErrorMessage } from "@hookform/error-message";
import type { UseFormReturn } from "react-hook-form";
import { inputStyle } from "../../styles/formStyles";
import type { ResourceFormType } from "@schema/dataset.schema";

export const ResourceForm: React.FC<{
  formObj: UseFormReturn<ResourceFormType>;
  datasetName: string;
}> = ({ formObj, datasetName }) => {
  const {
    register,
    formState: { errors },
  } = formObj;
  return (
    <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-2">
      <input
        type="text"
        className="hidden"
        {...register("package_id")}
        defaultValue={datasetName}
      />
      <div className="col-span-full ">
        <label htmlFor="name" className="block w-fit text-sm font-medium">
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
        <div className="col-span-full mt-2">
          <label
            htmlFor="description"
            className="block w-fit text-sm font-medium"
          >
            Description
          </label>
          <div className="mt-1 w-full">
            <textarea className={inputStyle} {...register("description")} />
            <ErrorMessage
              errors={errors}
              name="description"
              render={({ message }) => (
                <p className="text-justify text-xs text-red-600">{message}</p>
              )}
            />
          </div>
        </div>
      </div>
      <div className="sm:col-span-2"></div>
      <div className="sm:col-span-2"></div>
    </div>
  );
};
