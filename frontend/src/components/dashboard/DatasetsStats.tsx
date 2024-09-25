import {
  CircleStackIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/20/solid";
import type { SearchDatasetType } from "@schema/dataset.schema";
import { api } from "@utils/api";
import { useRef } from "react";

export default function DatasetsStats() {
  const datasetsQuery = useRef<SearchDatasetType>({
    query: "",
    offset: 0,
    limit: 1000,
    orgs: [],
    groups: [],
    tags: [],
    include_private: true,
  });

  const { data: datasets } = api.dataset.search.useQuery(
    datasetsQuery.current as unknown as SearchDatasetType
  );

  const stats = [
    {
      id: 1,
      name: "All",
      stat: datasets?.result.length ?? 0,
      icon: CircleStackIcon,
      cta: { title: "View all", href: "/datasets" },
    },
    {
      id: 2,
      name: "Published",
      stat: datasets?.result.length
        ? datasets.result.filter((d) => !d.private).length
        : 0,
      icon: EyeIcon,
    },
    {
      id: 3,
      name: "Private",
      stat: datasets?.result.length
        ? datasets.result.filter((d) => d.private).length
        : 0,
      icon: EyeSlashIcon,
    },
  ];

  return (
    <div className="my-10">
      <h2 className="mb-5 text-base font-semibold leading-6">My datasets</h2>
      <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.id}
            className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow dark:bg-slate-900 sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-slate-100 p-3 dark:bg-slate-800">
                <item.icon
                  className="h-6 w-6 text-secondary"
                  aria-hidden="true"
                />
              </div>
              <p className="ml-16 truncate text-sm font-medium opacity-75">
                {item.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold">{item.stat}</p>
              {item.cta && (
                <div className="absolute inset-x-0 bottom-0 bg-slate-100 px-4 py-4 dark:bg-slate-900 sm:px-6">
                  <div className="text-sm">
                    <a
                      href={item.cta.href}
                      className="font-medium text-secondary hover:text-secondary-hover"
                    >
                      {item.cta.title}
                      <span className="sr-only"> {item.name} stats</span>
                    </a>
                  </div>
                </div>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
