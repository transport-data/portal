import { Badge } from "@components/ui/badge";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import classNames from "@utils/classnames";
import { useRouter } from "next/router";

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

export default ({
  tdcValidated,
  title,
  keywords,
  visibility,
  dateState,
  updateFrequency,
  region,
  variant,
  href,
  contributors,
}: DashboardDatasetCardProps) => {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(href)}
      className="flex cursor-pointer gap-6"
    >
      {variant === "success" ? (
        <div className="flex h-8 w-8 flex-col items-center gap-32 lg:flex-row lg:gap-8">
          <Badge
            className="flex h-8 w-8 items-center justify-center pl-1.5 pr-1.5"
            icon={<CheckCircleIcon width={20} height={20} />}
            variant="success"
          />
        </div>
      ) : (
        <div className="h-8 w-8">
          <Badge
            className="flex items-center p-1"
            icon={
              <svg
                width="24"
                height="24"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.2002 28.8V36C7.2002 39.9768 14.7218 43.2 24.0002 43.2C33.2786 43.2 40.8002 39.9768 40.8002 36V28.8C40.8002 32.7768 33.2786 36 24.0002 36C14.7218 36 7.2002 32.7768 7.2002 28.8Z"
                  fill="#7E3AF2"
                />
                <path
                  d="M7.2002 16.8V24C7.2002 27.9768 14.7218 31.2 24.0002 31.2C33.2786 31.2 40.8002 27.9768 40.8002 24V16.8C40.8002 20.7768 33.2786 24 24.0002 24C14.7218 24 7.2002 20.7768 7.2002 16.8Z"
                  fill="#7E3AF2"
                />
                <path
                  d="M40.8002 12C40.8002 15.9768 33.2786 19.2 24.0002 19.2C14.7218 19.2 7.2002 15.9768 7.2002 12C7.2002 8.02319 14.7218 4.79999 24.0002 4.79999C33.2786 4.79999 40.8002 8.02319 40.8002 12Z"
                  fill="#7E3AF2"
                />
              </svg>
            }
            variant="purple"
          />
        </div>
      )}
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-4 justify-between">
          <h2 className="text-lg font-bold">{title}</h2>
          {tdcValidated && (
            <Badge variant={"success"} className="text-[#03543F]">
              TDC Validated
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          {(keywords || [])?.map((k) => (
            <Badge variant={"purple"} className="bg-[#E5EDFF] text-[#42389D]">
              {k}
            </Badge>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs">
          <Badge
            variant={"success"}
            className="capitalize"
            icon={
              visibility === "public" ? (
                <svg
                  width="14"
                  height="15"
                  viewBox="0 0 14 15"
                  fill="none"
                  stroke="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.25 7.5C12.25 8.89239 11.6969 10.2277 10.7123 11.2123C9.72774 12.1969 8.39239 12.75 7 12.75M12.25 7.5C12.25 6.10761 11.6969 4.77226 10.7123 3.78769C9.72774 2.80312 8.39239 2.25 7 2.25M12.25 7.5H1.75M7 12.75C5.60761 12.75 4.27226 12.1969 3.28769 11.2123C2.30312 10.2277 1.75 8.89239 1.75 7.5M7 12.75C7.96658 12.75 8.75 10.3992 8.75 7.5C8.75 4.60083 7.96658 2.25 7 2.25M7 12.75C6.03342 12.75 5.25 10.3992 5.25 7.5C5.25 4.60083 6.03342 2.25 7 2.25M7 2.25C5.60761 2.25 4.27226 2.80312 3.28769 3.78769C2.30312 4.77226 1.75 6.10761 1.75 7.5"
                    stroke-width="1.5"
                  />
                </svg>
              ) : (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.09409 10.9813C7.73351 11.0494 7.36732 11.0836 7.00034 11.0833C4.38818 11.0833 2.17734 9.36658 1.43359 7C1.63383 6.36306 1.94226 5.76535 2.34534 5.23308M5.76251 5.76275C6.09073 5.43453 6.53588 5.25014 7.00005 5.25014C7.46422 5.25014 7.90938 5.43453 8.23759 5.76275C8.56581 6.09097 8.7502 6.53612 8.7502 7.00029C8.7502 7.46446 8.56581 7.90962 8.23759 8.23783M5.76251 5.76275L8.23759 8.23783M5.76251 5.76275L8.23701 8.23667M8.23759 8.23783L10.1573 10.157M5.76368 5.76333L3.84451 3.84417M3.84451 3.84417L1.75034 1.75M3.84451 3.84417C4.78505 3.23725 5.88098 2.91515 7.00034 2.91667C9.61251 2.91667 11.8233 4.63342 12.5671 7C12.1565 8.3011 11.3038 9.41767 10.1568 10.1564M3.84451 3.84417L10.1568 10.1564M10.1568 10.1564L12.2503 12.25"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              )
            }
          >
            {visibility}
          </Badge>
          <span className="hidden sm:block">•</span>
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
            {dateState}
          </span>
          {updateFrequency && (
            <>
              <span className="hidden sm:block">•</span>
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
                {updateFrequency}
              </span>
            </>
          )}
          <span className="hidden sm:block">•</span>
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
            {region}
          </span>
          <span className="hidden sm:block">•</span>
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
                  <img
                    src={x.imageUrl}
                    className={classNames(
                      "h-6 w-6 rounded-full border-2 border-white dark:border-gray-800"
                    )}
                  />
                ) : (
                  <></>
                )
              )}
            </div>
          </span>
        </div>
      </div>
    </div>
  );
};
