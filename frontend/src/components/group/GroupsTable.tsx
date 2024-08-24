import { api } from "@utils/api";
import { useLayoutEffect, useRef, useState } from "react";
import type { Group } from "@portaljs/ckan";
import Modal from "@components/_shared/Modal";
import { EditGroupForm } from "./EditGroupForm";
import Link from "next/link";

export const GroupsTable: React.FC<{ publicUrl: string }> = ({ publicUrl }) => {
  const checkbox = useRef<HTMLInputElement>(null);
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState<Group[]>([]);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const { data: groups } = api.group.list.useQuery();

  const utils = api.useContext();
  const deleteGroups = api.group.delete.useMutation({
    onSuccess: async () => {
      await utils.group.list.invalidate();
    },
  });

  useLayoutEffect(() => {
    if (groups) {
      const isIndeterminate =
        selectedGroups.length > 0 && selectedGroups.length < groups.length;
      setChecked(selectedGroups.length === groups.length);
      setIndeterminate(isIndeterminate);
      if (checkbox.current) checkbox.current.indeterminate = isIndeterminate;
    }
  }, [selectedGroups, groups]);

  function toggleAll() {
    if (groups) {
      setSelectedGroups(checked || indeterminate ? [] : groups);
      setChecked(!checked && !indeterminate);
      setIndeterminate(false);
    }
  }

  return (
    <>
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="relative">
            {selectedGroups.length > 0 && (
              <div className="absolute left-14 top-0 flex h-12 items-center space-x-3 sm:left-12">
                {!deleteGroups.isLoading ? (
                  <button
                    type="button"
                    onClick={() => {
                      deleteGroups.mutate({
                        ids: selectedGroups.map((dataset) => dataset.id),
                      });
                    }}
                    className="inline-flex items-center rounded bg-background px-2 py-1 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white dark:bg-background-dark dark:ring-slate-600"
                  >
                    Delete all
                  </button>
                ) : (
                  <div className="loader mb-4 h-4 w-4 rounded-full border-4 border-t-4 border-gray-200 ease-linear"></div>
                )}
              </div>
            )}
            <div className="ring-1 ring-gray-300 dark:ring-slate-600 sm:mx-0 sm:rounded-lg">
              <table className="min-w-full table-fixed divide-y divide-gray-300 dark:divide-gray-600">
                <thead>
                  <tr>
                    <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
                      <input
                        type="checkbox"
                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-stone-900 focus:ring-stone-900"
                        ref={checkbox}
                        checked={checked}
                        onChange={toggleAll}
                      />
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold"
                    >
                      Description
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold"
                    >
                      Public link
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold"
                    >
                      Edit
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-600">
                  {groups && (
                    <>
                      {groups.map((group) => (
                        <tr
                          key={group.name}
                          className={
                            selectedGroups.includes(group)
                              ? "bg-gray-50 dark:bg-slate-700"
                              : undefined
                          }
                        >
                          <td className="relative px-7 sm:w-12 sm:px-6">
                            {selectedGroups.includes(group) && (
                              <div className="absolute inset-y-0 left-0 w-0.5 bg-stone-900" />
                            )}
                            <input
                              type="checkbox"
                              className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 focus:ring-stone-900"
                              value={group.name}
                              checked={selectedGroups.includes(group)}
                              onChange={(e) =>
                                setSelectedGroups(
                                  e.target.checked
                                    ? [...selectedGroups, group]
                                    : selectedGroups.filter((p) => p !== group)
                                )
                              }
                            />
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm opacity-75">
                            {group.name}
                          </td>
                          <td className="px-3 py-4 text-sm opacity-75">
                            {group.title}
                          </td>
                          <td className="px-3 py-4 text-sm opacity-75">
                            {group.description}
                          </td>
                          <td className="px-3 py-4 text-sm opacity-75">
                            <Link href={`${publicUrl}/${group.name}`}>
                              Public link
                            </Link>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm font-medium">
                            <button
                              onClick={() => setEditingGroup(group)}
                              className="opacity-75 hover:opacity-100"
                            >
                              Edit
                              <span className="sr-only">, {group.name}</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="Edit group"
        show={!!editingGroup}
        setShow={() => setEditingGroup(null)}
      >
        {editingGroup && <EditGroupForm initialValues={editingGroup} />}
      </Modal>
    </>
  );
};

export default GroupsTable;
