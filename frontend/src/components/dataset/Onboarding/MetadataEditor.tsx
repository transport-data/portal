import {
  type DataPackage,
  OptionsFields,
  type Resource,
  type Schema,
} from "@interfaces/datapackage.interface";
import { match, P } from "ts-pattern";
import {
  type Control,
  useFieldArray,
  type UseFormRegister,
  type UseFormReturn,
  type FieldErrors,
  type UseFormSetValue,
  Controller,
} from "react-hook-form";
import Input from "./Form/Input";
import Select from "./Form/Select";
import { Button } from "@components/ui/button";
import { inputStyle, selectStyle } from "@styles/formStyles";
import { ErrorMessage } from "@hookform/error-message";
import { api } from "@utils/api";
import MultiSelect from "@components/_shared/MultiSelect";
import { CustomSwitch } from "@components/_shared/CustomSwitch";

const SchemaForm: React.FC<{
  schema: Schema;
  resourceIndex: number;
  register: UseFormRegister<DataPackage>;
}> = ({ schema, resourceIndex, register }) => {
  const options = OptionsFields.map((type) => ({
    value: type,
    label: type.toUpperCase(),
  }));
  const fields = schema.fields.map((field, index) => {
    return (
      <div key={index}>
        <input
          className="hidden"
          defaultValue={field.name}
          {...register(
            `resources.${resourceIndex}.schema.fields.${index}.name`
          )}
        />
        <Select
          options={options}
          defaultValue={field.type}
          label={field.name}
          register={register(
            `resources.${resourceIndex}.schema.fields.${index}.type`
          )}
        />
      </div>
    );
  });
  return (
    <div className="col-span-full grid grid-cols-1 gap-2 sm:grid-cols-2">
      <h3 className="text-md text-bg-stone-600 col-span-full mt-4 font-medium">
        Table schema
      </h3>
      {fields}
    </div>
  );
};

const ResourceForm: React.FC<{
  resource: Resource;
  resourceIndex: number;
  register: UseFormRegister<DataPackage>;
}> = ({ resource, resourceIndex, register }) => {
  const resources = Object.entries(resource).map((entry, index) =>
    match(entry)
      .with([P.union("path"), P._], ([name, value]) => (
        <input
          key={resourceIndex}
          defaultValue={value as string}
          className="hidden"
          {...register(`resources.${resourceIndex}.${name}`)}
        />
      ))
      .with([P.union("name"), P._], ([name, value]) => (
        <div className="col-span-3" key={index}>
          <Input
            label={name}
            disabled={false}
            defaultValue={value as string}
            register={register(`resources.${resourceIndex}.${name}`)}
          />
        </div>
      ))
      .with([P.union("format", "size", "profile"), P._], ([name, value]) => (
        <div className="col-span-3" key={index}>
          <Input
            label={name}
            defaultValue={value as string}
            disabled
            register={register(`resources.${resourceIndex}.${name}`)}
          />
        </div>
      ))
      //React hook form adds an id so we do this to stop it from being pushed
      .with(["id", P._], () => <></>)
      .with(["schema", P._], ([, schema]) => (
        <SchemaForm
          key={index}
          schema={schema as unknown as Schema}
          resourceIndex={resourceIndex}
          register={register}
        />
      ))
      .otherwise(() => <></>)
  );

  return (
    <div className="col-span-full grid grid-cols-1 gap-2 py-4 sm:grid-cols-6">
      <h2 className="col-span-full text-lg font-semibold">
        {resource.name}
        <span className="ml-2 inline-flex items-center rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-medium dark:bg-slate-700">
          data resource
        </span>
      </h2>
      {resources}
    </div>
  );
};

const DataPackageForm: React.FC<{
  datapackage: DataPackage;
  control: Control<DataPackage>;
  register: UseFormRegister<DataPackage>;
  errors: FieldErrors<DataPackage>;
  setValue: UseFormSetValue<DataPackage>;
  disableName: boolean;
}> = ({ datapackage, register, control, errors }) => {
  //This will grab the resources and put in the resourceFields
  //Besides that we get the append and remove functions
  const { remove, fields: resourceFields } = useFieldArray({
    control: control,
    name: "resources",
  });

  const { data: organizations } =
    api.organization.listForUser.useQuery();

  const organizationOptions =
    organizations?.map((org) => ({
      value: org.id,
      label: org.title,
    })) ?? [];

  const { data: groups } = api.group.list.useQuery();

  const groupOptions = groups
    ? groups.map((group) => ({
        value: group.name,
        label: group.title,
      }))
    : [];

  return (
    <div className="gap-2 py-8 pr-4 lg:h-[600px] lg:overflow-y-scroll">
      <h1 className="mb-5 mt-1 text-3xl font-bold tracking-tight">
        Package Metadata
      </h1>
      <h2 className="text-lg font-semibold">
        {datapackage.name}
        <span className="ml-2 inline-flex items-center rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-medium dark:bg-slate-700">
          data package
        </span>
      </h2>
      <div className="grid grid-cols-6 gap-2">
        <div className="col-span-3">
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
        </div>
        <div className="col-span-3">
          <label htmlFor="title" className="block w-fit text-sm font-medium">
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
        <div className="col-span-3">
          <label htmlFor="title" className="block w-fit text-sm font-medium">
            Author
          </label>
          <div className="mt-1 w-full">
            <input type="text" className={inputStyle} {...register("author")} />
            <ErrorMessage
              errors={errors}
              name="author"
              render={({ message }) => (
                <p className="text-justify text-xs text-red-600">{message}</p>
              )}
            />
          </div>
        </div>{" "}
        <div className="col-span-3">
          <label htmlFor="title" className="block w-fit text-sm font-medium">
            Author Email
          </label>
          <div className="mt-1 w-full">
            <input type="text" className={inputStyle} {...register("author_email")} />
            <ErrorMessage
              errors={errors}
              name="author_email"
              render={({ message }) => (
                <p className="text-justify text-xs text-red-600">{message}</p>
              )}
            />
          </div>
        </div>{" "}
        <div className="col-span-3">
          <label htmlFor="coverage" className="block w-fit text-sm font-medium">
            Coverage
          </label>
          <div className="mt-1 w-full">
            <input
              type="text"
              className={inputStyle}
              {...register("coverage")}
            />
            <ErrorMessage
              errors={errors}
              name="coverage"
              render={({ message }) => (
                <p className="text-justify text-xs text-red-600">{message}</p>
              )}
            />
          </div>
        </div>{" "}
        <div className="col-span-3">
          <label htmlFor="rights" className="block w-fit text-sm font-medium">
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
        <div className="col-span-3">
          <label
            htmlFor="conforms_to"
            className="block w-fit text-sm font-medium"
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
        <div className="col-span-3">
          <label
            htmlFor="has_version"
            className="block w-fit text-sm font-medium"
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
        <div className="col-span-3">
          <label
            htmlFor="is_version_of"
            className="block w-fit text-sm font-medium"
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
        <div className="col-span-3">
          <label
            htmlFor="contact_point"
            className="block w-fit text-sm font-medium"
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
        <div className="col-span-3">
          <label htmlFor="language" className="block w-fit text-sm font-medium">
            Language
          </label>
          <div className="mt-1 w-full">
            <select className={selectStyle} {...register('language')}>
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
        <div className="col-span-full">
          <label htmlFor="message" className="block text-sm font-medium">
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
        <div className="col-span-3">
          <label
            htmlFor="owner_org"
            className="block w-fit text-sm font-medium"
          >
            Organization
          </label>
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-ignore */}
          <select {...register("owner_org")} className={selectStyle}>
            {organizationOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-3">
          <label htmlFor="groupsId" className="block w-fit text-sm font-medium">
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
      {resourceFields.length > 0 && (
        <h1 className="col-span-full pt-6 text-2xl font-bold tracking-tight">
          Resources Metadata
        </h1>
      )}
      {resourceFields.map((resource: Resource, index) => (
        <>
          <ResourceForm
            key={index}
            resource={resource}
            resourceIndex={index}
            register={register}
          />
          {datapackage.resources.length > 1 && (
            <div className="col-span-full">
              <Button
                variant="danger"
                type="button"
                onClick={() => remove(index)}
              >
                Remove resource
              </Button>
            </div>
          )}
        </>
      ))}
    </div>
  );
};

const MetadataEditor: React.FC<{
  datapackage: DataPackage;
  formObject: UseFormReturn<DataPackage>;
  disableName: boolean;
}> = ({ datapackage, formObject, disableName }) => {
  return (
    <>
      {datapackage && (
        <DataPackageForm
          setValue={formObject.setValue}
          control={formObject.control}
          disableName={disableName}
          datapackage={datapackage}
          register={formObject.register}
          errors={formObject.formState.errors}
        />
      )}
    </>
  );
};

export default MetadataEditor;
