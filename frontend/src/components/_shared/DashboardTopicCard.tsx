import { Badge } from "@components/ui/badge";
import { useRouter } from "next/router";
import { truncateText } from "@lib/utils";

export interface DashboardTopicCardProps {
  title: string;
  display_name: string;
  image_url: string | undefined;
  image_display_url: string;
  is_organization: boolean
  id: string;
  name: string;
  description: string;
  created: string;
  approval_status: string;
  type: string;
  state: string;
  num_followers: number;
  package_count: number;
}

export default ({
  title,
  display_name,
  image_url,
  image_display_url,
  is_organization,
  id,
  name,
  description,
  created,
  approval_status,
  type,
  state,
  num_followers,
  package_count,
}: DashboardTopicCardProps) => {
    const router = useRouter();
    return (
      <div
        // onClick={() => router.push(href)}
        className="flex w-full cursor-pointer gap-10 bg-white p-5 my-5"
      >
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold">{title}</h2>
            {state === "active" && (
              <Badge variant={"success"} className="text-[#03543F]">
                Active
              </Badge>
            )}
          </div>
          <div className="min-w-[400px] max-w-[600px] py-4">
            {description ? (
              <p>{truncateText(description, 20)}</p>
            ):(
              <p>No description provided.</p>
            )}
          </div>
          <div className="flex flex-col gap-2 text-xs md:flex-row md:items-center">
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
              Created On
            </span>
            {created && (
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
                  {created.toString().split('T')[0]}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };
