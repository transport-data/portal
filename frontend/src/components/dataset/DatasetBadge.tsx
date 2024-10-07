import { Badge } from "@components/ui/badge";
import {
  CheckCircleIcon,
  CircleStackIcon,
  ShieldCheckIcon,
} from "@heroicons/react/20/solid";

export default function DatasetBadge({
  tdc_category,
}: {
  tdc_category?: string;
}) {
  const defaults =
    "flex items-center justify-center w-[32px] h-[32px] rounded-[8px]";

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
    <>
      <Badge
        className="flex h-8 w-8 items-center justify-center pl-1.5 pr-1.5"
        icon={badgeIcon}
        variant={badgeVariant}
      />
    </>
  );
}
