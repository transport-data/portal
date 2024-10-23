import { useState } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  ComboboxButton,
} from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { User } from "@interfaces/ckan/user.interface";
import { Button } from "@components/ui/button";

export default ({
  selectedUser,
  setSelectedUser,
  options,
  onClose,
  onSubmit,
}: {
  selectedUser: any;
  setSelectedUser: any;
  options?: User[];
  onClose: () => void;
  onSubmit: () => void;
}) => {
  const [query, setQuery] = useState("");
  const filteredOptions =
    query === ""
      ? options
      : options?.filter((option) =>
          option?.display_name?.toLowerCase().includes(query?.toLowerCase())
        );
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-96 rounded-lg bg-white p-6 shadow-lg">
        <button onClick={onClose} className="absolute right-2 top-2">
          ✖️
        </button>
        <h2 className="mb-4 text-xl font-bold">Add Sysadmins</h2>
        <Combobox
          as="div"
          value={selectedUser}
          onChange={(user) => {
            setQuery("");
            setSelectedUser(user);
          }}
        >
          <div className="relative mt-2">
            <ComboboxInput
              placeholder="Select a User"
              className="w-full rounded-md border-0 bg-white py-1.5 pl-11 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#006064] sm:text-sm sm:leading-6"
              onChange={(event) => {
                setQuery(event.target.value);
              }}
              onBlur={() => {
                setQuery("");
              }}
              displayValue={(user: any) => user?.display_name}
            />
            <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none data-[open]:rotate-180">
              <ChevronDown size={14} />
            </ComboboxButton>

            {(filteredOptions?.length || 0) > 0 && (
              <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {filteredOptions?.map((user: User) => (
                  <ComboboxOption
                    key={user.id}
                    value={user}
                    className="group relative cursor-pointer select-none py-2 pl-3 pr-9 text-gray-500 hover:bg-[#E5E7EB]"
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="block truncate group-data-[selected]:font-semibold">
                        {user.display_name}
                      </span>
                    </div>
                  </ComboboxOption>
                ))}
              </ComboboxOptions>
            )}
          </div>
        </Combobox>

        <Button
          type="button"
          onClick={onSubmit}
          className={
            "mt-4 w-full " + (!selectedUser ? "disabled:opacity-50" : "")
          }
          disabled={!selectedUser}
        >
          Select
        </Button>
      </div>
    </div>
  );
};
