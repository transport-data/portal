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
import { Badge } from "@components/ui/badge";

export function Metadata({ dataset }: { dataset: Dataset }) {
  return (
    <div className="min-h-[500px] bg-gray-50">
      <div className="container grid py-8 lg:grid-cols-2">
        <div>
          <h3 className="text-3xl font-semibold leading-loose text-primary">
            Overview
          </h3>
          <p className="max-w-lg text-gray-500">
            For information on the ATO please contact{" "}
            <span className="underline">
              Jamie Leather, Chief Transport Sector Group ADB
            </span>{" "}
            or{" "}
            <span className="underline">asiantransportoutlook@gmail.com</span>
          </p>
        </div>
        <div className="flex flex-col gap-y-4 py-4">
          <div className="border-t border-gray-100 px-4 sm:col-span-1 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-primary">
              Description
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-500 sm:mt-2">
              {dataset.notes ?? "-"}
            </dd>
          </div>
          <div className="border-t border-gray-100 px-4 sm:col-span-1 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-primary">
              Keywords
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-500 sm:mt-2">-</dd>
          </div>
          <div className="border-t border-gray-100 px-4 sm:col-span-1 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-primary">
              Sources
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-500 sm:mt-2">
              <ul className="ml-6 list-disc marker:text-accent">
                <li>
                  <a className="text-accent underline" href="#">
                    Asian Transport Outlook (ATO)
                  </a>
                </li>
                <li>
                  <a className="text-accent underline" href="#">
                    Integrated Database of the European Energy System
                    (JRC-IDEES)
                  </a>
                </li>
              </ul>
            </dd>
          </div>
          <div className="border-t border-gray-100 px-4 sm:col-span-1 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-primary">
              Contributor
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-500 sm:mt-2">
              {dataset.author ?? "-"}
            </dd>
          </div>
          <div className="border-t border-gray-100 px-4 sm:col-span-1 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-primary">
              Reference Period
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-500 sm:mt-2">
              01 January 1990 - 31 December 2022
            </dd>
          </div>
          <div className="border-t border-gray-100 px-4 sm:col-span-1 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-primary">
              Last updated date
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-500 sm:mt-2">
              {dataset.metadata_modified &&
                new Date(dataset.metadata_modified).toDateString()}
            </dd>
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
              <a target="_blank" href="#" className="text-accent underline">
                {dataset.license_title}
              </a>
            </dd>
          </div>
        </div>
      </div>
      <div className="container grid py-8 lg:grid-cols-2">
        <div>
          <h3 className="text-3xl font-semibold leading-loose text-primary">
            Schedule
          </h3>
          <p className="max-w-lg text-gray-500">
            The dataset is updated every year in March
          </p>
        </div>
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>DATE</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead>UPDATE</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="text-gray-500">23/03/2023</TableCell>
                <TableCell>
                  <Badge variant="success">Latest</Badge>
                </TableCell>
                <TableCell>March 2023</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-gray-500">11/07/2022</TableCell>
                <TableCell>
                  <Badge variant="muted">Past</Badge>
                </TableCell>
                <TableCell>March 2022 - Revisited</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-gray-500">17/03/2022</TableCell>
                <TableCell>
                  <Badge variant="muted">Past</Badge>
                </TableCell>
                <TableCell>March 2022</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-gray-500">17/06/2022</TableCell>
                <TableCell>
                  <Badge variant="muted">Past</Badge>
                </TableCell>
                <TableCell>March 2021</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
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
                content: <p>teste</p>,
              },
              {
                type: "quotation",
                label: "Chicago",
                content: <p>teste 2</p>,
              },
              {
                type: "quotation",
                label: "Harvard",
                content: <></>,
              },
              {
                type: "quotation",
                label: "MLA",
                content: <></>,
              },
              {
                type: "quotation",
                label: "Bluebook",
                content: <></>,
              },
            ]}
          />
          <Citation
            dataset={dataset}
            options={[
              {
                type: "code",
                label: "APA",
                content: <p>teste</p>,
              },
              {
                type: "code",
                label: "Chicago",
                content: <p>teste 2</p>,
              },
              {
                type: "code",
                label: "Harvard",
                content: <></>,
              },
              {
                type: "code",
                label: "MLA",
                content: <></>,
              },
              {
                type: "code",
                label: "Bluebook",
                content: <></>,
              },
              {
                type: "code",
                label: "BibTex",
                content: <></>,
              },
              {
                type: "code",
                label: "APA 2",
                content: <p>teste</p>,
              },
              {
                type: "code",
                label: "MLA 2",
                content: <p>teste 2</p>,
              },
              {
                type: "code",
                label: "Chicago 2",
                content: <></>,
              },
              {
                type: "code",
                label: "Harvard 2",
                content: <></>,
              },
              {
                type: "code",
                label: "Vancouver 2",
                content: <></>,
              },
              {
                type: "code",
                label: "BibTex 2",
                content: <></>,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
