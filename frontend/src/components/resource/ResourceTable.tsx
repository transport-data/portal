import type { Dataset } from "@portaljs/ckan";
import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Resource } from "@portaljs/ckan";
import { api } from "@utils/api";
import Modal from "@components/_shared/Modal";
import { EditResourceForm } from "./EditResourceForm";

export const ResourceTable: React.FC<{
  datasetData: Dataset;
  publicUrl: string;
}> = ({ datasetData, publicUrl }) => {
  const checkbox = useRef<HTMLInputElement>(null);
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedResources, setSelectedResources] = useState<Resource[]>([]);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);

  const utils = api.useContext();
  const deleteResources = api.resource.delete.useMutation({
    onSuccess: async () => {
      await utils.dataset.get.invalidate({
        name: datasetData.id,
      });
    },
  });

  useLayoutEffect(() => {
    if (datasetData) {
      const isIndeterminate =
        selectedResources.length > 0 &&
        selectedResources.length < datasetData.resources.length;
      setChecked(selectedResources.length === datasetData.resources.length);
      setIndeterminate(isIndeterminate);
      if (checkbox.current) checkbox.current.indeterminate = isIndeterminate;
    }
  }, [selectedResources, datasetData]);

  function toggleAll() {
    if (datasetData) {
      setSelectedResources(
        checked || indeterminate ? [] : datasetData.resources
      );
      setChecked(!checked && !indeterminate);
      setIndeterminate(false);
    }
  }
  return (
    <>
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="relative">
            {selectedResources.length > 0 && (
              <div className="absolute left-14 top-0 flex h-12 items-center space-x-3 sm:left-12">
                {true ? (
                  <button
                    type="button"
                    onClick={() => {
                      deleteResources.mutate({
                        ids: selectedResources.map((resource) =>
                          resource.id ? resource.id : ""
                        ),
                      });
                    }}
                    className="inline-flex items-center rounded bg-background px-2 py-1 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white dark:bg-background-dark dark:ring-slate-600"
                  >
                    Delete all
                  </button>
                ) : (
                  <div className="loader mb-4 h-4 w-4 rounded-full border-4 border-t-4 border-gray-200 ease-linear dark:border-slate-600"></div>
                )}
              </div>
            )}
            <div className="ring-1 ring-gray-300 dark:ring-slate-600 sm:mx-0 sm:rounded-lg">
              <table className="min-w-full table-fixed divide-y divide-gray-300 dark:divide-slate-600">
                <thead>
                  <tr>
                    <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
                      <input
                        type="checkbox"
                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 focus:ring-stone-600"
                        ref={checkbox}
                        checked={checked}
                        onChange={toggleAll}
                      />
                    </th>
                    <th
                      scope="col"
                      className="min-w-[12rem] py-3.5 pl-3 text-left text-sm font-semibold"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold"
                    >
                      Download
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
                      Created at
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold"
                    >
                      Public link
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-3"
                    >
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-600">
                  {datasetData.resources.map((resource) => (
                    <tr
                      key={resource.id}
                      className={
                        selectedResources.includes(resource)
                          ? "bg-gray-50 dark:bg-slate-700"
                          : undefined
                      }
                    >
                      <td className="relative px-7 sm:w-12 sm:px-6">
                        {selectedResources.includes(resource) && (
                          <div className="absolute inset-y-0 left-0 w-0.5 bg-stone-600" />
                        )}
                        <input
                          type="checkbox"
                          className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 focus:ring-stone-600 dark:border-slate-600"
                          value={resource.id}
                          checked={selectedResources.includes(resource)}
                          onChange={(e) =>
                            setSelectedResources(
                              e.target.checked
                                ? [...selectedResources, resource]
                                : selectedResources.filter(
                                    (p) => p !== resource
                                  )
                            )
                          }
                        />
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm opacity-75">
                        {resource.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm opacity-75">
                        {resource.url ? (
                          <Link
                            href={resource.url}
                            className="opacity-75 hover:opacity-100"
                          >
                            Download here
                          </Link>
                        ) : (
                          <span className="opacity-75 hover:opacity-100">
                            No download link
                          </span>
                        )}
                      </td>
                      <td className="text-justify px-3 py-4 text-sm opacity-75">
                        {resource.description}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm opacity-75">
                        {resource.created?.toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm opacity-75">
                        {!datasetData.private ? (
                          <Link href={`${publicUrl}/${resource.id}`}>
                            Public link
                          </Link>
                        ) : (
                          "No public link"
                        )}
                      </td>
                      <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium opacity-75 sm:pr-3">
                        <button
                          onClick={() => setEditingResource(resource)}
                          className="opacity-75 hover:opacity-100"
                        >
                          Edit
                          <span className="sr-only">, {resource.id}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="Edit resource"
        show={!!editingResource}
        setShow={() => setEditingResource(null)}
      >
        {editingResource && (
          <EditResourceForm initialValues={editingResource} />
        )}
      </Modal>
    </>
  );
};
