import { Controller, useForm } from "react-hook-form";
import { inputStyle, selectStyle } from "@styles/formStyles";
import type { Dispatch, SetStateAction } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import MultiSelect from "@components/_shared/MultiSelect";
import {
  SearchDatasetSchema,
  type SearchDatasetType,
} from "@schema/dataset.schema";
import classNames from "@utils/classnames";
import { api } from "@utils/api";

export const SearchDatasetForm: React.FC<{
  setDatasetSearch: Dispatch<SetStateAction<SearchDatasetType>>;
}> = ({ setDatasetSearch }) => {
  const { register, watch, control } = useForm<SearchDatasetType>({
    resolver: zodResolver(SearchDatasetSchema),
  });

  const { data: groups } = api.group.list.useQuery({
    showGeographyShapes: false,
    type: "topic",
  });

  const groupOptions = groups
    ? groups.map((group) => ({
        value: group.name,
        label: group.title,
      }))
    : [];

  const { data: organizations } = api.organization.list.useQuery();

  const organizationOptions = organizations
    ? organizations.map((organization) => ({
        value: organization.name,
        label: organization.title,
      }))
    : [];

  return (
    <form
      className="my-2 grid grid-cols-1 items-end gap-2 sm:grid-cols-3"
      onChange={() => setDatasetSearch(watch())}
    >
      <div>
        <label
          htmlFor="queryString"
          className="block w-fit text-sm font-medium"
        >
          Search datasets
        </label>
        <div className="mt-1 w-full">
          <input
            className={classNames(inputStyle, "pl-3")}
            placeholder="Search text"
            {...register("query")}
          />
        </div>
      </div>
      <div className="mt-1 w-full">
        <label htmlFor="orgs" className="block w-fit text-sm font-medium">
          Organisations
        </label>
        {organizations && (
          <Controller
            control={control}
            name="orgs"
            render={({ field: { onChange, value } }) => (
              <MultiSelect
                onChange={(values) => {
                  onChange(values);
                  setDatasetSearch(watch());
                }}
                options={organizationOptions}
                value={value}
              />
            )}
          />
        )}
      </div>
      <div className="mt-1 w-full">
        <label htmlFor="groups" className="block w-fit text-sm font-medium">
          Groups
        </label>
        {groups && (
          <Controller
            control={control}
            name="groups"
            render={({ field: { onChange, value } }) => (
              <MultiSelect
                onChange={(values) => {
                  onChange(values);
                  setDatasetSearch(watch());
                }}
                options={groupOptions}
                value={value}
              />
            )}
          />
        )}
      </div>
    </form>
  );
};
