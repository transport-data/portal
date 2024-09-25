import { Badge } from "@components/ui/badge";
import {
  CheckCircleIcon,
  CircleStackIcon,
  ShieldCheckIcon,
} from "@heroicons/react/20/solid";
import { Dataset } from "@interfaces/ckan/dataset.interface";
import { formatDate } from "@lib/utils";
import { useRouter } from "next/router";
import { capitalize } from "remeda";
import geography from "@data/geography.json";
import UserAvatar from "./UserAvatar";
import { EyeOffIcon, GlobeAltIcon } from "@lib/icons";

export interface DashboardDatasetCardProps {
  tdcValidated?: boolean;
  title: string;
  variant: "success" | "purple" | "x";
  href: string;
  keywords?: string[];
  visibility: "public" | "draft" | "private";
  dateState: string;
  updateFrequency?: string;
  region: string;
  contributors: { imageUrl: string }[];
}

export default function DashboardDatasetCard(props: Dataset) {
  const router = useRouter();

  const {
    tdc_category,
    title,
    tags,
    metadata_modified,
    frequency,
    state,
    geographies,
    contributors,
  } = props;

  const badgeVariant =
    tdc_category === "tdc_harmonized"
      ? "warning"
      : tdc_category === "tdc_formatted"
      ? "success"
      : "purple";

  const badgeIconOptions = {
    width: 20,
    height: 20,
  };

  const badgeIcon =
    tdc_category === "tdc_harmonized" ? (
      <ShieldCheckIcon {...badgeIconOptions} />
    ) : tdc_category === "tdc_formatted" ? (
      <CheckCircleIcon {...badgeIconOptions} />
    ) : (
      <CircleStackIcon {...badgeIconOptions} />
    );

  return (
    <div
      onClick={() => router.push("#")}
      className="flex w-full cursor-pointer gap-6"
    >
      <div className="flex h-8 w-8 flex-col items-center gap-32 lg:flex-row lg:gap-8">
        <Badge
          className="flex h-8 w-8 items-center justify-center pl-1.5 pr-1.5"
          icon={badgeIcon}
          variant={badgeVariant}
        />
      </div>

      <div className="w-full space-y-2 text-sm">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold">{title}</h2>
          {tdc_category === "tdc_formatted" && (
            <Badge variant={"success"} className="text-[#03543F]">
              TDC Formatted
            </Badge>
          )}
          {tdc_category === "tdc_harmonized" && (
            <Badge variant={"warning"}>TDC Harmonized</Badge>
          )}
        </div>

        <div className="flex gap-2">
          {(tags || [])?.map((k) => (
            <Badge variant={"purple"} className="bg-[#E5EDFF] text-[#42389D]">
              {capitalize(k.display_name ?? "")}
            </Badge>
          ))}
        </div>

        <div className="flex flex-col gap-2 text-xs md:flex-row md:items-center">
          {state === "draft" ? (
            <Badge
              variant={"success"}
              className="capitalize"
              icon={<EyeOffIcon />}
            >
              Draft
            </Badge>
          ) : state === "active" ? (
            <Badge
              variant={"success"}
              className="capitalize"
              icon={<GlobeAltIcon />}
            >
              Public
            </Badge>
          ) : (
            <></>
          )}

          <span className="hidden xl:block">•</span>
          <span className="flex items-center gap-1">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.20039 1.3999C4.01474 1.3999 3.83669 1.47365 3.70542 1.60493C3.57414 1.7362 3.50039 1.91425 3.50039 2.0999V2.7999H2.80039C2.42909 2.7999 2.07299 2.9474 1.81044 3.20995C1.54789 3.4725 1.40039 3.8286 1.40039 4.1999V11.1999C1.40039 11.5712 1.54789 11.9273 1.81044 12.1899C2.07299 12.4524 2.42909 12.5999 2.80039 12.5999H11.2004C11.5717 12.5999 11.9278 12.4524 12.1903 12.1899C12.4529 11.9273 12.6004 11.5712 12.6004 11.1999V4.1999C12.6004 3.8286 12.4529 3.4725 12.1903 3.20995C11.9278 2.9474 11.5717 2.7999 11.2004 2.7999H10.5004V2.0999C10.5004 1.91425 10.4266 1.7362 10.2954 1.60493C10.1641 1.47365 9.98604 1.3999 9.80039 1.3999C9.61474 1.3999 9.43669 1.47365 9.30542 1.60493C9.17414 1.7362 9.10039 1.91425 9.10039 2.0999V2.7999H4.90039V2.0999C4.90039 1.91425 4.82664 1.7362 4.69537 1.60493C4.56409 1.47365 4.38604 1.3999 4.20039 1.3999ZM4.20039 4.8999C4.01474 4.8999 3.83669 4.97365 3.70542 5.10493C3.57414 5.2362 3.50039 5.41425 3.50039 5.5999C3.50039 5.78555 3.57414 5.9636 3.70542 6.09488C3.83669 6.22615 4.01474 6.2999 4.20039 6.2999H9.80039C9.98604 6.2999 10.1641 6.22615 10.2954 6.09488C10.4266 5.9636 10.5004 5.78555 10.5004 5.5999C10.5004 5.41425 10.4266 5.2362 10.2954 5.10493C10.1641 4.97365 9.98604 4.8999 9.80039 4.8999H4.20039Z"
                fill="#6B7280"
              />
            </svg>
            {formatDate(metadata_modified ?? "")}
          </span>

          {frequency && (
            <>
              <span className="hidden xl:block">•</span>
              <span className="flex items-center gap-1">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M2.09961 11.9002C2.09961 11.7146 2.17336 11.5365 2.30463 11.4053C2.43591 11.274 2.61396 11.2002 2.79961 11.2002H11.1996C11.3853 11.2002 11.5633 11.274 11.6946 11.4053C11.8259 11.5365 11.8996 11.7146 11.8996 11.9002C11.8996 12.0859 11.8259 12.2639 11.6946 12.3952C11.5633 12.5265 11.3853 12.6002 11.1996 12.6002H2.79961C2.61396 12.6002 2.43591 12.5265 2.30463 12.3952C2.17336 12.2639 2.09961 12.0859 2.09961 11.9002ZM4.40471 4.69514C4.27348 4.56387 4.19976 4.38586 4.19976 4.20024C4.19976 4.01463 4.27348 3.83661 4.40471 3.70534L6.50471 1.60534C6.63598 1.47411 6.81399 1.40039 6.99961 1.40039C7.18522 1.40039 7.36324 1.47411 7.49451 1.60534L9.59451 3.70534C9.72202 3.83736 9.79257 4.01418 9.79098 4.19772C9.78939 4.38126 9.71577 4.55683 9.58598 4.68661C9.4562 4.8164 9.28063 4.89002 9.09709 4.89161C8.91355 4.89321 8.73673 4.82265 8.60471 4.69514L7.69961 3.79004V9.10024C7.69961 9.28589 7.62586 9.46394 7.49458 9.59522C7.36331 9.72649 7.18526 9.80024 6.99961 9.80024C6.81396 9.80024 6.63591 9.72649 6.50463 9.59522C6.37336 9.46394 6.29961 9.28589 6.29961 9.10024V3.79004L5.39451 4.69514C5.26324 4.82637 5.08522 4.90009 4.89961 4.90009C4.71399 4.90009 4.53598 4.82637 4.40471 4.69514Z"
                    fill="#6B7280"
                  />
                </svg>
                {capitalize(frequency)}
              </span>
            </>
          )}

          {geographies && geographies[0] && (
            <>
              <span className="hidden xl:block">•</span>
              <span className="flex items-center gap-1">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.00039 12.5999C8.4856 12.5999 9.90999 12.0099 10.9602 10.9597C12.0104 9.9095 12.6004 8.48512 12.6004 6.9999C12.6004 5.51469 12.0104 4.09031 10.9602 3.0401C9.90999 1.9899 8.4856 1.3999 7.00039 1.3999C5.51518 1.3999 4.0908 1.9899 3.04059 3.0401C1.99039 4.09031 1.40039 5.51469 1.40039 6.9999C1.40039 8.48512 1.99039 9.9095 3.04059 10.9597C4.0908 12.0099 5.51518 12.5999 7.00039 12.5999ZM3.03279 5.6188C3.29269 4.8745 3.75644 4.21818 4.37119 3.7246C4.55879 4.0109 4.88219 4.1999 5.25039 4.1999C5.52887 4.1999 5.79594 4.31053 5.99285 4.50744C6.18977 4.70435 6.30039 4.97143 6.30039 5.2499V5.5999C6.30039 5.97121 6.44789 6.3273 6.71044 6.58985C6.97299 6.8524 7.32909 6.9999 7.70039 6.9999C8.07169 6.9999 8.42779 6.8524 8.69034 6.58985C8.95289 6.3273 9.10039 5.97121 9.10039 5.5999C9.10028 5.2866 9.20526 4.98231 9.39854 4.73573C9.59182 4.48915 9.86223 4.31453 10.1665 4.2398C10.8345 5.00397 11.202 5.98492 11.2004 6.9999C11.2004 7.2379 11.1808 7.4724 11.1423 7.6999H10.5004C10.1291 7.6999 9.77299 7.8474 9.51044 8.10995C9.24789 8.3725 9.10039 8.7286 9.10039 9.0999V10.6378C8.4622 11.0071 7.73771 11.201 7.00039 11.1999V9.7999C7.00039 9.4286 6.85289 9.0725 6.59034 8.80995C6.32779 8.5474 5.97169 8.3999 5.60039 8.3999C5.22909 8.3999 4.87299 8.2524 4.61044 7.98985C4.34789 7.7273 4.20039 7.37121 4.20039 6.9999C4.20051 6.6688 4.08329 6.34837 3.86952 6.09552C3.65576 5.84267 3.3593 5.67377 3.03279 5.6188Z"
                    fill="#6B7280"
                  />
                </svg>
                {geography.filter((g) => g.code === geographies[0])[0]?.title}
              </span>
            </>
          )}

          {contributors && contributors[0] && (
            <>
              <span className="hidden xl:block">•</span>
              <span className="flex items-center gap-1">
                <span>Contributors</span>
                <div className="flex -space-x-2 rtl:space-x-reverse">
                  {contributors.map((x, i) =>
                    i === 4 ? (
                      <a
                        className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gray-700 text-xs font-medium text-white hover:bg-gray-600 dark:border-gray-800"
                        href="#"
                      >
                        {contributors.length - 4}
                      </a>
                    ) : i < 4 ? (
                      <UserAvatar id={x} />
                    ) : (
                      <></>
                    )
                  )}
                </div>
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
