import { Activity } from "@portaljs/ckan";
import { EyeOff, Globe, Building, Database } from "lucide-react";

export default (activity: Activity) => {
  const activitySegments = activity.activity_type?.split(" ");
  const activityType = activitySegments ? activitySegments[0] : "changed";
  const activityTarget = activitySegments
    ? activitySegments[1] === "package"
      ? "dataset"
      : activitySegments[1]
    : "entity";

  let actionText = "";
  let color = "black";
  switch (activityType) {
    case "new":
      actionText = "created a new ";
      color = "green";
      break;
    case "changed":
      actionText = "updated the ";
      color = "purple";
      break;
    case "deleted":
      actionText = "deleted the ";
      color = "red";
      break;
    //  TODO: what other activity types are there?
  }

  const fullText = `You ${actionText} ${activityTarget}`;

  let linkHref = "";
  let linkTitle: string | undefined = "";
  switch (activityTarget) {
    case "dataset":
      linkHref = `datasets/${activity.data?.package?.name}/resources`;
      linkTitle = activity.data?.package?.title;
      break;
    case "organization":
      linkTitle = activity.data?.group?.title;
      linkHref = "/dashboard/organizations";
      break;
    case "group":
      linkTitle = activity.data?.group?.title;
      linkHref = "/dashboard/topics";
      break;
  }

  if (activityType == "deleted") {
    //  Unset href if entity was deleted
    linkHref = "";
  }
  return (
    <div key={activity.id}>
      <div className="mt-5 flex flex-row items-start">
        <div className="mr-3 rounded-full">
          {activityTarget === "dataset" ? (
            <Database size={20} color={color} />
          ) : (
            <Building size={20} color={color} />
          )}
        </div>
        <p className="text-sm">
          {fullText}{" "}
          {linkHref ? (
            <a className="font-semibold" href={linkHref}>
              {linkTitle}
            </a>
          ) : (
            <span className="font-semibold">{linkTitle}</span>
          )}{" "}
          <span className="text-xs">
            {`at ${new Date(activity.timestamp).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })}`}
          </span>
        </p>
      </div>
      <div className="my-3">
        {activityTarget === "dataset" && activity.data?.package?.private ? (
          <span className="mx-8 flex items-center gap-1 text-xs">
            <EyeOff size={14} /> private
          </span>
        ) : (
          <span className="mx-8 flex items-center gap-1 text-xs">
            <Globe size={14} /> public
          </span>
        )}
      </div>
      <hr></hr>
    </div>
  );
};
