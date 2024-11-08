import { useFieldArray, useFormContext } from "react-hook-form";
import { QueryFormType } from "./search.schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePossibleValues } from "./queryHooks";
import { Button } from "@components/ui/button";

interface Column {
  key: string;
  name: string;
  type: string;
}

function Filter({
  column,
  resourceId,
  index,
  remove,
}: {
  column: string;
  resourceId: string;
  index: number;
  remove: () => void;
}) {
  const form = useFormContext<QueryFormType>();
  const { data: possibleValues } = usePossibleValues({
    resourceId,
    column,
    enabled: true,
  });
  if (!possibleValues) return null;
  return (
    <DropdownMenu>
      <Button asChild>
        <DropdownMenuTrigger>{column}</DropdownMenuTrigger>
      </Button>
      <DropdownMenuContent>
        <ul>
          <button
            className="ms-2 cursor-pointer text-sm font-medium text-gray-900 dark:text-gray-300"
            onClick={() => remove()}
          >
            Remove filter
          </button>
          {possibleValues.map((value) => (
            <li>
              <div className="mb-4 flex items-center">
                <input
                  id={`${column}-${value.key}`}
                  defaultChecked={
                    form.watch(`filters.${index}.values`).length === 0
                  }
                  {...form.register(`filters.${index}.values`)}
                  type="checkbox"
                  value={value.key}
                  className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                />
                <label
                  htmlFor={`${column}-${value.key}`}
                  className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  {value.name}
                </label>
              </div>
            </li>
          ))}
        </ul>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Filters({
  columns,
  resourceId,
}: {
  columns: Column[];
  resourceId: string;
}) {
  const form = useFormContext<QueryFormType>();
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control: form.control, // control props comes from useForm (optional: if you are using FormProvider)
      name: "filters", // unique name for your Field Array
    }
  );
  const addFilter = (column: Column) => {
    append({ column: column.key, values: [], type: column.type });
  };
  return (
    <>
      <DropdownMenu>
        <Button asChild>
          <DropdownMenuTrigger>Add filter</DropdownMenuTrigger>
        </Button>
        <DropdownMenuContent>
          {columns.map((column) => (
            <DropdownMenuItem onClick={() => addFilter(column)}>
              {column.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {fields.map((field, index) => (
        <Filter
          column={field.column}
          resourceId={resourceId}
          index={index}
          remove={() => remove(index)}
        />
      ))}
    </>
  );
}
