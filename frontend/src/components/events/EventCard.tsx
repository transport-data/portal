import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import {
  ArrowRightIcon,
  BuildingLibraryIcon,
  ClockIcon,
  MapPinIcon,
} from "@heroicons/react/20/solid";
import { cn, formatDatePeriod } from "@lib/utils";
import Link from "next/link";
import Markdown from "react-markdown";
import remarkFrontmatter from "remark-frontmatter";

export default function EventCard({
  className,
  image,
  title,
  from,
  to,
  source,
  organization,
  location,
  showContent = true,
  showImage = true,
  link,
}: {
  title: string;
  className?: string;
  image?: string;
  from?: string;
  to?: string;
  source?: string;
  organization?: string;
  location?: string;
  showContent?: boolean;
  showImage?: boolean;
  link?: string;
}) {
  return (
    <div
      className={`${cn("flex flex-col gap-4 rounded-lg bg-white ", className)}`}
    >
      <Badge
        variant={"success"}
        icon={<ClockIcon width={16} />}
        className="bg-[#E3F9ED] text-[#006064]"
      >
        {formatDatePeriod(from ?? "", to ?? "")}
      </Badge>
      {showImage && (
        <img
          src={image}
          className="h-[192px] w-full rounded-[8px] object-cover object-center"
        />
      )}
      <span className="block text-xl font-bold">{title}</span>
      {showContent && (
        <div className="text-gray-500">
          <Markdown remarkPlugins={[remarkFrontmatter]}>{source}</Markdown>
        </div>
      )}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-[2.5px] text-gray-500">
          <BuildingLibraryIcon width={16} />
          <span className="text-sm font-medium">{organization}</span>
        </div>
        <div className="flex items-center gap-[2.5px] text-gray-500">
          <MapPinIcon width={16} />
          <span className="text-sm font-medium">{location}</span>
        </div>
      </div>
      {link && (
        <Button
          variant="outline"
          className="border-gray flex w-fit items-center gap-2 hover:bg-gray-100 hover:text-gray-900"
          asChild
        >
          <Link href={link} target="_blank">
            Show details
            <ArrowRightIcon width={20} />
          </Link>
        </Button>
      )}
    </div>
  );
}
