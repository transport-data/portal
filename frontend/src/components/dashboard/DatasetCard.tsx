import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import * as timeago from "timeago.js";
import Modal from "@components/_shared/Modal";
import { EditDatasetForm } from "@components/dataset/EditDatasetForm";
import Link from "next/link";
import { Dataset } from "@interfaces/ckan/dataset.interface";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface DatasetCardProps {
  dataset: Dataset;
  publicUrl: string;
}

export default function DatasetCard({ dataset, publicUrl }: DatasetCardProps) {
  const [editingDataset, setEditingDataset] = useState(false);
  return (
    <>
      <li
        key={dataset.id}
        className="overflow-hidden rounded-xl border border-gray-200 dark:border-slate-950"
      >
        <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-slate-200 px-6 py-3 dark:border-slate-950/5 dark:bg-slate-900">
          <div>
            <Link
              href={`${publicUrl}/${dataset.organization?.name}/${
                dataset.name
              }${dataset.private ? "/private" : ""}`}
            >
              <div className="line-clamp-1 text-base font-semibold leading-6">
                {dataset.title}
              </div>
            </Link>
            <div className="line-clamp-1 text-sm font-medium leading-6 opacity-50">
              {dataset?.notes ?? "No description"}
            </div>
          </div>
          <Menu as="div" className="relative ml-auto">
            <Menu.Button className="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500">
              <span className="sr-only">Open options</span>
              <EllipsisHorizontalIcon className="h-5 w-5" aria-hidden="true" />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none dark:bg-slate-800">
                <Menu.Item>
                  <button
                    className="block w-full px-3 py-1 text-start text-sm leading-6 text-gray-900 hover:bg-gray-200 dark:text-white dark:hover:bg-slate-700"
                    onClick={() => setEditingDataset(!editingDataset)}
                  >
                    Edit<span className="sr-only">, {dataset.name}</span>
                  </button>
                </Menu.Item>
                <Menu.Item>
                  <Link
                    href={`/datasets/${dataset.name}/resources`}
                    className="block w-full px-3 py-1 text-start text-sm leading-6 text-gray-900 hover:bg-gray-200 dark:text-white dark:hover:bg-slate-700"
                  >
                    Resources<span className="sr-only">, {dataset.name}</span>
                  </Link>
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
        <dl className="-my-3 divide-y divide-slate-100 px-6 py-4 text-sm leading-6 dark:divide-slate-600">
          <div className="flex justify-between gap-x-4 py-2">
            <dt className="opacity-75">Last modified</dt>
            <dd>
              <time>
                {dataset.metadata_modified
                  ? timeago.format(dataset.metadata_modified, "en_US", {
                      relativeDate:
                        Date.now() + new Date().getTimezoneOffset() * 60 * 1000,
                    })
                  : ""}
              </time>
            </dd>
          </div>
          <div className="flex justify-between gap-x-4 py-2">
            <dt className="opacity-75">No. of resources</dt>
            <dd className="flex items-start gap-x-2">
              <div className="font-medium">{dataset.num_resources}</div>
            </dd>
          </div>

          <div className="flex justify-between gap-x-4 py-2">
            <dt className="opacity-75">Visibility</dt>
            <dd className="flex items-start gap-x-2">
              <div className="rounded-2xl border-2 border-slate-300 px-4 font-medium capitalize dark:border-slate-700">
                {dataset.private ? "Private" : "Public"}
              </div>
            </dd>
          </div>
        </dl>
      </li>
      <Modal
        title="Edit dataset"
        show={editingDataset}
        setShow={() => setEditingDataset(!editingDataset)}
      >
        {editingDataset && <EditDatasetForm initialValues={dataset} />}
      </Modal>
    </>
  );
}
