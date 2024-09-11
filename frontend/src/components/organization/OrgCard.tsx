import getConfig from "next/config";
import Image from "next/image";
import Link from "next/link";
import { Organization } from "@portaljs/ckan";

type OrgCardProps = Pick<
  Organization,
  "display_name" | "image_display_url" | "description" | "name"
>;

export default function GroupCard({
  display_name,
  image_display_url,
  description,
  name,
}: OrgCardProps) {
  const url = image_display_url ? new URL(image_display_url) : undefined;
  return (
    <div className="col-span-3 h-full rounded-lg bg-white p-8 shadow-lg">
      <Image
        src={image_display_url ?? "/images/logos/DefaultOrgLogo.svg"}
        alt={`${name}-collection`}
        width="43"
        height="43"
      ></Image>
      <h3 className="font-inter mt-4 text-lg font-semibold">{display_name}</h3>
      <p className="font-inter mb-6 mt-1 line-clamp-2 text-sm font-medium">
        {description}
      </p>
      <Link href={`/@${name}`}>
        <span className="font-inter cursor-pointer text-sm font-medium text-accent">
          View -&gt;
        </span>
      </Link>
    </div>
  );
}
