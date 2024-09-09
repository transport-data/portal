import { Dataset } from "@portaljs/ckan";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Citation } from "./Citation";
import { formatBytes, cn, formatIcon, getFileName } from "@lib/utils";
import { ArrowDownIcon, ArrowDownToLineIcon, ChevronRightIcon, DownloadIcon } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ArrowUpIcon } from "@heroicons/react/24/outline";

//convert date string to Month Year format
function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
}

const chartData = [
  {
    dateHuman: "September 2022",
    downloads: 9,
    date: "2022-09-05",
  },
  {
    dateHuman: "October 2022",
    downloads: 14,
    date: "2022-10-05",
  },
  {
    dateHuman: "Jan 2023",
    downloads: 6,
    date: "2023-01-05",
  },
  {
    dateHuman: "Feb 2023",
    downloads: 16,
    date: "2023-02-05",
  },
  {
    dateHuman: "Mar 2023",
    downloads: 12,
    date: "2023-03-05",
  },
  {
    dateHuman: "April 2023",
    downloads: 20,
    date: "2023-04-05",
  },
];

const chartConfig = {
  downloads: {
    label: "Downloads",
    color: "182 100% 20%",
  },
} satisfies ChartConfig;

export function Downloads({ dataset }: { dataset: Dataset }) {
  function trackDownload(resourceId: string) {
    //@ts-ignore
    if (typeof window !== "undefined" && window._paq) {
      //@ts-ignore
      window._paq.push(['trackEvent', 'DownloadResource', resourceId]);
      //@ts-ignore
      window._paq.push(['trackEvent', 'DownloadDataset', dataset.id]);
    }
  }
  return (
    <div className="min-h-[500px] bg-gray-50">
      <div className="container grid py-8 lg:grid-cols-2">
        <div>
          <h3 className="text-3xl font-semibold leading-loose text-primary">
            Data and Resources
          </h3>
          <p className="max-w-lg text-gray-500">
            The dataset is maintained and updated by TDC and comprises of data
            from multiple sources that were validated and harmonised to build a
            single repository.
          </p>
        </div>
        <div className="flex flex-col gap-y-4 py-4">
          <ul
            role="list"
            className="divide-y divide-gray-100 rounded-md border border-gray-200"
          >
            {dataset.resources.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6 transition hover:bg-gray-100"
              >
                <div className="flex w-0 flex-1 items-center">
                  <img
                    src={formatIcon(r.format?.toLowerCase() ?? "")}
                    aria-hidden="true"
                    className="h-8 w-8 flex-shrink-0 text-gray-400"
                  />
                  <div className="ml-4 flex min-w-0 flex-1 gap-2">
                    <span className="truncate font-medium">
                      {r.name ?? getFileName(r.url ?? "")}
                    </span>
                    {r.size && (
                      <span className="flex-shrink-0 text-gray-400">
                        {formatBytes(r.size)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <a
                    href={r.url}
                    onClick={() => trackDownload(r.id)}
                    className="font-medium text-gray-500 hover:text-accent"
                  >
                    <ArrowDownToLineIcon className="h-5 w-5" />
                  </a>
                </div>
              </li>
            ))}
          </ul>
          <span className="flex items-center gap-x-1 text-sm font-semibold text-accent">
            Show advanced options{" "}
            <ChevronRightIcon className="mt-0.5 h-4 w-4" />
          </span>
        </div>
      </div>
      <div className="container grid py-8 lg:grid-cols-2">
        <div>
          <h3 className="text-3xl font-semibold leading-loose text-primary">
            Downloads statistics
          </h3>
        </div>
        <div className="flex flex-col gap-y-4 py-4">
          <div className="grid grid-cols-2">
            <div className="pb-4 pl-4">
              <dd className="flex items-baseline">
                <p className="text-3xl font-semibold text-gray-900">128</p>
                <p className=" ml-2 flex items-baseline text-base font-semibold text-green-600">
                  10%
                  <ArrowUpIcon
                    aria-hidden="true"
                    className="h-5 w-5 flex-shrink-0 self-center text-green-500"
                  />
                </p>
              </dd>
              <p className="truncate text-sm font-medium text-gray-500">
                Downloads past 6 Months
              </p>
            </div>
            <div className="pb-4 pl-4">
              <dd className="flex items-baseline">
                <p className="text-3xl font-semibold text-gray-900">12k</p>
              </dd>
              <p className="truncate text-sm font-medium text-gray-500">
                Total downloads
              </p>
            </div>
          </div>
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <LineChart accessibilityLayer data={chartData}>
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => formatDate(value)}
              />
              <YAxis
                dataKey="downloads"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <CartesianGrid vertical={false} />
              <Line
                type="step"
                dot={false}
                dataKey="downloads"
                stroke="#006064"
                strokeWidth={2}
                fill="var(--transparent)"
                radius={4}
              />
              <ChartTooltip
                content={<ChartTooltipContent labelKey="dateHuman" />}
              />
            </LineChart>
          </ChartContainer>
        </div>
      </div>
      <div className="container grid py-8 lg:grid-cols-2">
        <div>
          <h3 className="text-3xl font-semibold leading-loose text-primary">
            Documentation
          </h3>
          <p className="max-w-lg text-gray-500">
            Expanded description and dataset documentation
          </p>
        </div>
        <div className="flex flex-col gap-y-4 py-4">
          <ul
            role="list"
            className="divide-y divide-gray-100 rounded-md border border-gray-200"
          >
            {[
              {
                name: "TDC Database documentation (2023 edition) Updated: 23 March 2023",
                id: 1,
                format: "PDF",
                url: "https://google.com",
                size: null,
              },
              {
                name: "TDC Database documentation (2023 edition) Updated: 23 March 2023",
                id: 1,
                format: "PDF",
                url: "https://google.com",
                size: null,
              },
              {
                name: "TDC Database documentation (2023 edition) Updated: 23 March 2023",
                id: 1,
                format: "PDF",
                url: "https://google.com",
                size: null,
              },
            ].map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6 transition hover:bg-gray-100"
              >
                <div className="flex w-0 flex-1 items-center">
                  <img
                    src={formatIcon(r.format?.toLowerCase() ?? "")}
                    aria-hidden="true"
                    className="h-8 w-8 flex-shrink-0 text-gray-400"
                  />
                  <div className="ml-4 flex min-w-0 flex-1 gap-2">
                    <span className="truncate font-medium">
                      {r.name ?? getFileName(r.url ?? "")}
                    </span>
                    {r.size && (
                      <span className="flex-shrink-0 text-gray-400">
                        {formatBytes(r.size)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <a
                    href={r.url}
                    className="font-medium text-primary hover:text-accent"
                  >
                    <DownloadIcon className="h-5 w-5" />
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
