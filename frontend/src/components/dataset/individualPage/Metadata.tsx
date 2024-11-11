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
import { Badge } from "@components/ui/badge";
import { Dataset } from "@interfaces/ckan/dataset.interface";
import { api } from "@utils/api";
import { Skeleton } from "@mui/material";
import { prettifyDateString } from "@utils/prettifyDateString";
import { getChoicesFromField } from "@utils/dataset";
import { slugify } from "@lib/utils";
import { ScrollArea } from "@components/ui/scroll-area";

function getLastNameAndInitials(dataset: Dataset) {
  if (!dataset.contributors_data || dataset.contributors_data.length === 0)
    return (
      dataset.organization?.display_name ?? dataset.organization?.name ?? "TDC"
    );
  const contributors = dataset.contributors_data.filter(c => c.name !== 'ckan_admin') ?? [];
  const contributorsCitations = contributors.map((contributor) => {
    console.log("CONTRIBUTOR", contributor);
    if (contributor.fullname) {
      const splittedName = contributor?.fullname
        ?.split(" ")
        .filter((n) => n !== "" && n !== " ");
      const length = splittedName.length;
      const lastName = splittedName[length - 1];
      const initials = splittedName.map((n) => n[0]).join(".");
      return `${lastName}, ${initials}`;
    }
    const splittedName = contributor?.name
      ?.split(" ")
      .filter((n) => n !== "" && n !== " ");
    const length = splittedName.length;
    const lastName = splittedName[length - 1];
    const initials = splittedName.map((n) => n[0]).join(".");
    return `${lastName}, ${initials}`;
  });
  return contributorsCitations.join(", ");
}

function getLastNameAndFirstName(dataset: Dataset) {
  if (!dataset.contributors_data || dataset.contributors_data.length === 0)
    return (
      dataset.organization?.display_name ?? dataset.organization?.name ?? "TDC"
    );
  const contributors = dataset.contributors_data;
  const contributorsCitations = contributors.map((contributor) => {
    if (contributor.fullname) {
      const splittedName = contributor?.fullname
        ?.split(" ")
        .filter((n) => n !== "" && n !== " ");
      const length = splittedName.length;
      const lastName = splittedName[length - 1];
      const firstName = splittedName[0];
      if (length === 1) return lastName;
      return `${lastName}, ${firstName}`;
    }
    const splittedName = contributor?.name
      ?.split(" ")
      .filter((n) => n !== "" && n !== " ");
    const length = splittedName.length;
    const lastName = splittedName[length - 1];
    const firstName = splittedName[0];
    if (length === 1) return lastName;
    return `${lastName}, ${firstName}`;
  });
  return contributorsCitations.join(", ");
}

export function Metadata({ dataset }: { dataset: Dataset }) {
  const { data: geographies } = api.group.tree.useQuery({
    type: "geography",
  });
  const datasetRegion = !dataset.regions
    ? null
    : dataset.regions.length === 0
    ? null
    : dataset.regions.length === 1
    ? (dataset.regions[0] as string)
    : "Worldwide";
  return (
    <div className="min-h-[500px] bg-gray-50">
      <div className="container grid py-8 lg:grid-cols-2">
        <div>
          <h3 className="text-3xl font-semibold leading-loose text-primary">
            Overview
          </h3>
          <p
            className="prose max-w-lg text-gray-500"
            dangerouslySetInnerHTML={{
              __html: dataset.overview_text ?? "-",
            }}
          ></p>
        </div>
        <div className="flex flex-col gap-y-4 py-4">
          <div className="border-t border-gray-100 px-4 sm:col-span-1 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-primary">
              Description
            </dt>
            <div
              className="prose mt-1 text-sm leading-6 text-gray-500 sm:mt-2"
              dangerouslySetInnerHTML={{
                __html: dataset.notes ?? "-",
              }}
            ></div>
          </div>
          <div className="border-t border-gray-100 px-4 sm:col-span-1 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-primary">
              Keywords
            </dt>
            {dataset.tags && dataset.tags.length > 0 ? (
              <dd className="mt-1 flex flex-wrap gap-2 text-sm leading-6 text-gray-500 sm:mt-2">
                {dataset.tags?.map((t) => (
                  <Badge variant="info">{t.display_name ?? t.name}</Badge>
                )) ?? "-"}
              </dd>
            ) : (
              <dd className="mt-1 flex flex-wrap text-sm leading-6 text-gray-500 sm:mt-2">
                -
              </dd>
            )}
          </div>
          <div className="border-t border-gray-100 px-4 sm:col-span-1 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-primary">
              Sources
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-500 sm:mt-2">
              {dataset.sources && dataset.sources.length > 0 ? (
                <ul className="ml-6 list-disc marker:text-accent">
                  {dataset.sources.map((source, index) => (
                    <li key={index}>
                      {source.url ? (
                        <a className="text-accent underline" href={source.url}>
                          {source.title}
                        </a>
                      ) : (
                        <span className="text-accent">{source.title}</span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                "-"
              )}
            </dd>
          </div>
          <div className="border-t border-gray-100 px-4 sm:col-span-1 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-primary">
              Contributors
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-500 sm:mt-2">
              <ul className="ml-6 list-disc marker:text-accent">
                {dataset.contributors_data &&
                  dataset.contributors_data.map((contributor, index) => (
                    <li className="text-accent">
                      {contributor.fullname || contributor.name}
                    </li>
                  ))}
              </ul>
            </dd>
          </div>
          <div className="border-t border-gray-100 px-4 sm:col-span-1 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-primary">
              Reference Period
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-500 sm:mt-2">
              {dataset.temporal_coverage_start &&
                dataset.temporal_coverage_end && (
                  <>
                    {prettifyDateString(dataset.temporal_coverage_start)} -{" "}
                    {prettifyDateString(dataset.temporal_coverage_end)}
                  </>
                )}
            </dd>
          </div>
          <div className="border-t border-gray-100 px-4 sm:col-span-1 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-primary">
              Last updated date
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-500 sm:mt-2">
              {dataset.metadata_modified && (
                <>
                  {prettifyDateString(
                    dataset.metadata_modified.split("T")[0] ?? ""
                  )}
                </>
              )}
            </dd>
          </div>
          <div className="border-t border-gray-100 px-4 sm:col-span-1 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-primary">
              Region
            </dt>
            {datasetRegion && geographies && (
              <dd className="mt-1 text-sm leading-6 text-gray-500 sm:mt-2">
                {datasetRegion &&
                geographies.find((g) => g.name === datasetRegion)?.title
                  ? geographies.find((g) => g.name === datasetRegion)?.title
                  : "Worldwide"}
              </dd>
            )}
            {!datasetRegion && (
              <dd className="mt-1 text-sm leading-6 text-gray-500 sm:mt-2">
                -
              </dd>
            )}
          </div>
          <div className="border-t border-gray-100 px-4 sm:col-span-1 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-primary">
              Visibility
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-500 sm:mt-2">
              {dataset.private ? "Private" : "Public"}
            </dd>
          </div>
          <div className="border-t border-gray-100 px-4 sm:col-span-1 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-primary">
              License
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-500 sm:mt-2">
              {dataset.license_url ? (
                <a
                  target="_blank"
                  href={dataset.license_url}
                  className="text-accent underline"
                >
                  {dataset.license_title}
                </a>
              ) : (
                "-"
              )}
            </dd>
          </div>
        </div>
      </div>
      <DatasetUpdates dataset={dataset} />
      <div className="container grid py-8 lg:grid-cols-2">
        <div>
          <h3 className="text-3xl font-semibold leading-loose text-primary">
            Citation format
          </h3>
          <p className="max-w-lg text-gray-500">
            Accurate citations in multiple formats
          </p>
        </div>
        <div className="flex flex-col gap-y-4">
          <Citation
            dataset={dataset}
            options={[
              {
                type: "quotation",
                label: "APA",
                content: `${getLastNameAndInitials(dataset)}. (${
                  dataset.metadata_created
                    ? new Date(dataset.metadata_created).getFullYear()
                    : "n.d"
                }). <i> ${dataset.title ?? dataset.name}</i> [Data set]. ${
                  dataset.organization?.display_name ??
                  dataset.organization?.name ??
                  "TDC"
                }. ${typeof window !== "undefined" && window.location.href}`,
              },
              {
                type: "quotation",
                label: "MLA",
                content: `${getLastNameAndFirstName(dataset)}. <i>${
                  dataset.title ?? dataset.name
                }</i>, ${
                  dataset.organization?.display_name ??
                  dataset.organization?.name ??
                  "TDC"
                }, ${
                  dataset.metadata_created
                    ? new Date(dataset.metadata_created).getFullYear()
                    : "(n.d)"
                }, ${typeof window !== "undefined" && window.location.href}`,
              },
              {
                type: "quotation",
                label: "Chicago",
                content: `${getLastNameAndInitials(dataset)}. <i>${
                  dataset.title ?? dataset.name
                }</i>. ${
                  dataset.metadata_created
                    ? new Date(dataset.metadata_created).getFullYear()
                    : "(n.d)"
                }. ${
                  dataset.organization?.display_name ??
                  dataset.organization?.name ??
                  "TDC"
                }. ${typeof window !== "undefined" && window.location.href}`,
              },
              {
                type: "quotation",
                label: "Harvard",
                content: `${getLastNameAndInitials(dataset)}. (${
                  dataset.metadata_created
                    ? new Date(dataset.metadata_created).getFullYear()
                    : "n.d"
                }). '${dataset.title ?? dataset.name}'. Available at: ${
                  typeof window !== "undefined" && window.location.href
                }`,
              },
            ]}
          />
          <Citation
            dataset={dataset}
            options={[
              {
                type: "code",
                label: "BibTex",
                content: `
@techreport{${
                  slugify(
                    (dataset.creator_user?.fullname ?? "TDC").replaceAll(
                      " ",
                      ""
                    )
                  ) + new Date(dataset.metadata_created as string).getFullYear()
                },
   author = {${dataset.contributors_data.filter(c => c.name !== 'ckan_admin').map((c) => c.fullname).join(", ")}},
   year = ${new Date(dataset.metadata_created as string).getFullYear()},
   title = {${dataset.title ?? dataset.name}},
   institution = {${
     dataset.organization?.title ?? dataset.organization?.name ?? "TDC"
   }},
   url = {${typeof window !== "undefined" && window.location.href}}
}
`,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

export function ContributorLine({ userId }: { userId: string }) {
  const { data: user, isLoading } = api.user.getUsersByIds.useQuery({
    ids: [userId],
  });
  if (isLoading)
    return (
      <li>
        <Skeleton className="h-4 w-12" />
      </li>
    );
  const contriburor = user && user.length > 0 ? user[0] : null;
  if (!contriburor) return <></>;
  return (
    <span className="text-accent">
      {contriburor.fullname ?? contriburor.display_name ?? contriburor.name} - (
      {contriburor.email})
    </span>
  );
}

function DatasetUpdates({ dataset }: { dataset: Dataset }) {
  const datasetSchema = api.dataset.schema.useQuery();
  const { data: activities, isLoading } = api.dataset.activities.useQuery({
    name: dataset.name,
  });
  function formatDate(date: Date) {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0 based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }
  return (
    <div className="container grid py-8 lg:grid-cols-2">
      <div>
        <h3 className="text-3xl font-semibold leading-loose text-primary">
          Schedule
        </h3>
        {datasetSchema.data && (
          <p className="max-w-lg text-gray-500">
            The dataset is updated{" "}
            {
              getChoicesFromField(datasetSchema.data, "frequency").find(
                (o) => o.value === dataset.frequency
              )?.label
            }
          </p>
        )}
      </div>
      <div>
        <ScrollArea className="h-96">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>DATE</TableHead>
                <TableHead>STATUS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading &&
                [0, 1, 2].map((i) => (
                  <TableRow>
                    <TableCell className="text-gray-500">
                      <Skeleton className="h-4 w-12" />
                    </TableCell>
                    <TableCell className="text-gray-500">
                      <Skeleton className="h-4 w-12" />
                    </TableCell>
                  </TableRow>
                ))}
              {activities?.result.map((activity, index) => (
                <TableRow>
                  <TableCell className="text-gray-500">
                    {formatDate(new Date(activity.timestamp))}
                  </TableCell>
                  <TableCell>
                    {index === 0 ? (
                      <Badge variant="success">Latest</Badge>
                    ) : (
                      <Badge variant="muted">Past</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
}
