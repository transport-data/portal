import { api } from "@utils/api";
import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { SearchDatasetForm } from "./DatasetSearchForm";
import type { SearchDatasetType } from "@schema/dataset.schema";
import type { Dataset } from "@portaljs/ckan";
import Modal from "@components/_shared/Modal";
import { EditDatasetForm } from "./EditDatasetForm";
import Spinner from "@components/_shared/Spinner";

export const DatasetTable: React.FC<{ publicUrl: string }> = ({
  publicUrl,
}) => {
  const checkbox = useRef<HTMLInputElement>(null);
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedDatasets, setSelectedDatasets] = useState<Dataset[]>([]);
  const [editingDataset, setEditingDataset] = useState<Dataset | null>(null);
  const [datasetSearch, setDatasetSearch] = useState<SearchDatasetType>({
    orgs: [],
    query: "",
    offset: 0,
    limit: 1000,
    groups: [],
    tags: [],
    include_private: true,
  });
  const { data: {datasets} = {} } = api.dataset.search.useQuery(
    datasetSearch as unknown as SearchDatasetType
  );

  const utils = api.useContext();
  const deleteDatasets = api.dataset.delete.useMutation({
    onSuccess: async () => {
      await utils.dataset.search.invalidate();
    },
  });

  useLayoutEffect(() => {
    if (datasets) {
      const isIndeterminate =
        selectedDatasets.length > 0 &&
        selectedDatasets.length < datasets.length;
      setChecked(selectedDatasets.length === datasets.length);
      setIndeterminate(isIndeterminate);
      if (checkbox.current) checkbox.current.indeterminate = isIndeterminate;
    }
  }, [selectedDatasets, datasets]);

  function toggleAll() {
    if (datasets) {
      setSelectedDatasets(checked || indeterminate ? [] : datasets);
      setChecked(!checked && !indeterminate);
      setIndeterminate(false);
    }
  }

  return (
    <>
      <SearchDatasetForm setDatasetSearch={setDatasetSearch} />
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="relative">
            {selectedDatasets.length > 0 && (
              <div className="absolute left-14 top-0 flex h-12 items-center space-x-3 sm:left-12">
                <button
                  type="button"
                  disabled={deleteDatasets.isLoading}
                  onClick={() => {
                    deleteDatasets.mutate({
                      ids: selectedDatasets.map((dataset) => dataset.id),
                    });
                  }}
                  className="inline-flex items-center rounded bg-background px-2 py-1 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed  dark:bg-background-dark dark:ring-slate-600"
                >
                  {deleteDatasets.isLoading && (
                    <Spinner className="mr-2 h-3 w-3" />
                  )}
                  Delete all
                </button>
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
                      Visibility
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold"
                    >
                      Resources
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
                  {datasets && (
                    <>
                      {datasets.map((dataset) => (
                        <tr
                          key={dataset.name}
                          className={
                            selectedDatasets.includes(dataset)
                              ? "bg-gray-50 dark:bg-slate-700"
                              : undefined
                          }
                        >
                          <td className="relative px-7 sm:w-12 sm:px-6">
                            {selectedDatasets.includes(dataset) && (
                              <div className="absolute inset-y-0 left-0 w-0.5 bg-stone-900" />
                            )}
                            <input
                              type="checkbox"
                              className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 focus:ring-stone-900"
                              value={dataset.name}
                              checked={selectedDatasets.includes(dataset)}
                              onChange={(e) =>
                                setSelectedDatasets(
                                  e.target.checked
                                    ? [...selectedDatasets, dataset]
                                    : selectedDatasets.filter(
                                        (p) => p !== dataset
                                      )
                                )
                              }
                            />
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm opacity-75">
                            {dataset.name}
                          </td>
                          <td className="px-3 py-4 text-sm opacity-75">
                            {dataset.title}
                          </td>
                          <td className="text-justify px-3 py-4 text-sm opacity-75">
                            {dataset.notes}
                          </td>
                          <td className="px-3 py-4 text-sm opacity-75">
                            {dataset.private ? "Private" : "Public"}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm font-medium">
                            <Link
                              href={`/datasets/${dataset.name}/resources`}
                              className="opacity-75 hover:opacity-100"
                            >
                              Resources
                              <span className="sr-only">, {dataset.name}</span>
                            </Link>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm font-medium">
                            {dataset.private ? (
                              <span className="opacity-75 hover:opacity-100">
                                No public link
                                <span className="sr-only">
                                  , {dataset.name}
                                </span>
                              </span>
                            ) : (
                              <Link
                                href={`${publicUrl}/${dataset.organization?.name}/${dataset.name}`}
                                className="opacity-75 hover:opacity-100"
                              >
                                Public link
                                <span className="sr-only">
                                  , {dataset.name}
                                </span>
                              </Link>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm font-medium">
                            <button
                              onClick={() => setEditingDataset(dataset)}
                              className="opacity-75 hover:opacity-100"
                            >
                              Edit
                              <span className="sr-only">, {dataset.name}</span>
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
        title="Edit dataset"
        show={!!editingDataset}
        setShow={() => setEditingDataset(null)}
      >
        {editingDataset && <EditDatasetForm initialValues={editingDataset} />}
      </Modal>
    </>
  );
};

export default DatasetTable;
