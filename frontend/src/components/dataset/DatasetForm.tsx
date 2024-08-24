import { ErrorMessage } from "@hookform/error-message";
import type { UseFormReturn } from "react-hook-form";
import { Controller } from "react-hook-form";
import { inputStyle, selectStyle } from "../../styles/formStyles";
import { api } from "@utils/api";
import MultiSelect from "@components/_shared/MultiSelect";
import { CustomSwitch } from "@components/_shared/CustomSwitch";
import type { DatasetFormType } from "@schema/dataset.schema";

export const DatasetForm: React.FC<{
  formObj: UseFormReturn<DatasetFormType>;
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

  const { data: organizations } =
    api.organization.listForUser.useQuery();

  const organizationOptions =
    organizations?.map((org) => ({
      value: org.id,
      label: org.title,
    })) ?? [];

  return (
    <div className="grid grid-cols-1 items-end gap-2 sm:grid-cols-2">
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
      <div>
        <label
          htmlFor="contact_point"
          className="block w-fit text-sm font-medium opacity-75"
        >
          Author
        </label>
        <div className="mt-1 w-full">
          <input
            type="text"
            className={inputStyle}
            {...register("author")}
          />
          <ErrorMessage
            errors={errors}
            name="author"
            render={({ message }) => (
              <p className="text-justify text-xs text-red-600">{message}</p>
            )}
          />
        </div>
      </div>{" "}
      <div>
        <label
          htmlFor="contact_point"
          className="block w-fit text-sm font-medium opacity-75"
        >
          Author Email
        </label>
        <div className="mt-1 w-full">
          <input
            type="text"
            className={inputStyle}
            {...register("author_email")}
          />
          <ErrorMessage
            errors={errors}
            name="author_email"
            render={({ message }) => (
              <p className="text-justify text-xs text-red-600">{message}</p>
            )}
          />
        </div>
      </div>{" "}
      <div>
        <label
          htmlFor="coverage"
          className="block w-fit text-sm font-medium opacity-75"
        >
          Coverage
        </label>
        <div className="mt-1 w-full">
          <input type="text" className={inputStyle} {...register("coverage")} />
          <ErrorMessage
            errors={errors}
            name="coverage"
            render={({ message }) => (
              <p className="text-justify text-xs text-red-600">{message}</p>
            )}
          />
        </div>
      </div>{" "}
      <div>
        <label
          htmlFor="rights"
          className="block w-fit text-sm font-medium opacity-75"
        >
          Rights
        </label>
        <div className="mt-1 w-full">
          <input type="text" className={inputStyle} {...register("rights")} />
          <ErrorMessage
            errors={errors}
            name="rights"
            render={({ message }) => (
              <p className="text-justify text-xs text-red-600">{message}</p>
            )}
          />
        </div>
      </div>{" "}
      <div>
        <label
          htmlFor="conforms_to"
          className="block w-fit text-sm font-medium opacity-75"
        >
          Conforms to
        </label>
        <div className="mt-1 w-full">
          <input
            type="text"
            className={inputStyle}
            {...register("conforms_to")}
          />
          <ErrorMessage
            errors={errors}
            name="conforms_to"
            render={({ message }) => (
              <p className="text-justify text-xs text-red-600">{message}</p>
            )}
          />
        </div>
      </div>{" "}
      <div>
        <label
          htmlFor="has_version"
          className="block w-fit text-sm font-medium opacity-75"
        >
          Has version
        </label>
        <div className="mt-1 w-full">
          <input
            type="text"
            className={inputStyle}
            {...register("has_version")}
          />
          <ErrorMessage
            errors={errors}
            name="has_version"
            render={({ message }) => (
              <p className="text-justify text-xs text-red-600">{message}</p>
            )}
          />
        </div>
      </div>{" "}
      <div>
        <label
          htmlFor="is_version_of"
          className="block w-fit text-sm font-medium opacity-75"
        >
          Is version of
        </label>
        <div className="mt-1 w-full">
          <input
            type="text"
            className={inputStyle}
            {...register("is_version_of")}
          />
          <ErrorMessage
            errors={errors}
            name="is_version_of"
            render={({ message }) => (
              <p className="text-justify text-xs text-red-600">{message}</p>
            )}
          />
        </div>
      </div>{" "}
      <div>
        <label
          htmlFor="contact_point"
          className="block w-fit text-sm font-medium opacity-75"
        >
          Contact point
        </label>
        <div className="mt-1 w-full">
          <input
            type="text"
            className={inputStyle}
            {...register("contact_point")}
          />
          <ErrorMessage
            errors={errors}
            name="contact_point"
            render={({ message }) => (
              <p className="text-justify text-xs text-red-600">{message}</p>
            )}
          />
        </div>
      </div>{" "}
      <div>
        <label
          htmlFor="language"
          className="block w-fit text-sm font-medium opacity-75"
        >
          Language
        </label>
        <div className="mt-1 w-full">
          <select className={selectStyle} {...register("language")}>
            <option value={"EN"}>EN</option>
            <option value={"FR"}>FR</option>
            <option value={"ES"}>ES</option>
            <option value={"DE"}>DE</option>
            <option value={"IT"}>IT</option>
          </select>
          <ErrorMessage
            errors={errors}
            name="language"
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
            {...register("notes")}
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="owner_org"
          className="block w-fit text-sm font-medium opacity-75"
        >
          Organization
        </label>
        <select {...register("owner_org")} className={selectStyle}>
          {organizationOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label
          htmlFor="groupsId"
          className="block w-fit text-sm font-medium opacity-75"
        >
          Groups
        </label>
        {groups && (
          <Controller
            control={control}
            name="groupsId"
            render={({ field: { onChange, value } }) => (
              <MultiSelect
                onChange={onChange}
                options={groupOptions}
                value={value}
              />
            )}
          />
        )}
      </div>
      <div className="py-2 sm:col-span-2">
        <label
          htmlFor="private"
          className="block text-sm font-medium opacity-75"
        >
          Private
        </label>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <CustomSwitch
              defaultValue={false}
              control={control}
              name="private"
            />
          </div>
          <div className="ml-3">
            <p className="text-sm opacity-50">
              Checking this will mean that this dataset and all its children
              will not be available for the public consumption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
