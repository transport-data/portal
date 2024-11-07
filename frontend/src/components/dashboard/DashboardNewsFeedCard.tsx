import { ApprovalStatus } from "@interfaces/ckan/dataset.interface";
import { Organization } from "@schema/organization.schema";
import { api } from "@utils/api";
import { EyeOff, Globe, Building, Database, User } from "lucide-react";
import { useSession } from "next-auth/react";

export interface DashboardNewsfeedCardProps {
  id: string;
  isSysAdmin: boolean;
  adminOrEditorUserOrgs: Map<string, "admin" | "editor">;
  timestamp: string;
  user_id: string;
  object_id?: string;
  activity_type?: string;
  user_data?: { name?: string; display_image?: string };
  data?: {
    group?: {
      title?: string;
      id?: string;
      name?: string;
      state?: string;
    };
    package?: {
      name?: string;
      approval_status?: ApprovalStatus | "reviewed";
      title?: string;
      private?: boolean;
      organization?: Organization;
      state?: string;
    };
    actor?: string;
  };
}

export default (activity: DashboardNewsfeedCardProps) => {
  const { data: sessionData } = useSession();
  const { adminOrEditorUserOrgs, isSysAdmin } = activity;
  const user_id = sessionData?.user?.id;

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
    case "reviewed":
      const reviewStatus =
        activity.data?.package?.approval_status || "reviewed";
      actionText = `${
        ["reviewed", "pending"].includes(reviewStatus)
          ? "requested review of"
          : reviewStatus
      } the `;
      color =
        reviewStatus === "rejected"
          ? "red"
          : reviewStatus === "approved"
          ? "green"
          : "black";
      break;
    //  TODO: what other activity types are there?
  }

  let actor = "";
  if (activity.user_id == user_id) {
    actor = "You";
  } else if (activity?.user_data?.name) {
    actor = activity?.user_data?.name;
  } else if (activity?.data?.actor) {
    actor = activity.data.actor;
  } else if (typeof activity?.user_data === "string") {
    actor = activity?.user_data;
  }
  let linkHref = "";
  let linkTitle: string | undefined = "";
  switch (activityTarget) {
    case "dataset":
      const role = adminOrEditorUserOrgs.get(
        activity.data?.package?.organization?.id || ""
      );

      if (role || isSysAdmin) {
        linkHref = `/dashboard/datasets/${activity.data?.package?.name}/edit`;
      } else {
        linkHref = `/${activity.data?.package?.organization?.name}/${
          activity.data?.package?.name
        }${
          activity.data?.package?.private ||
          activity.data?.package?.state === "draft"
            ? "/private"
            : ""
        }`;
      }
      linkTitle = activity.data?.package?.title;
      break;
    case "organization":
      linkTitle = activity.data?.group?.title;
      if (isSysAdmin) {
        linkHref = `/dashboard/organizations/${activity.data?.group?.id}/edit`;
      } else {
        linkHref = `/search?query=${activity.data?.group?.id}`;
      }
      break;
    case "group":
      linkTitle = activity.data?.group?.title;
      if (isSysAdmin) {
        linkHref = `/dashboard/topics/${activity.data?.group?.id}/edit`;
      } else {
        linkHref = `/search?topic=${activity.data?.group?.id}`;
      }
      break;
  }
  const fullText = `${actionText} ${activityTarget}`;

  if (activityType == "deleted") {
    //  Unset href if entity was deleted
    linkHref = "";
  }
  return (
    <div key={activity.id}>
      <div className="my-5 flex flex-row items-start">
        <div className="mr-3 h-12 w-12 overflow-hidden rounded-full bg-gray-100">
          {activity?.user_data?.display_image ? (
            <img
              src={activity?.user_data?.display_image}
              alt="Profile picture of user"
              className="h-12 w-12 object-cover"
            />
          ) : (
            <User className="mx-auto h-12 h-12" />
          )}
        </div>
        <div>
          <p className="text-base">
            <span className="font-medium text-gray-900">{actor}</span>{" "}
            <span className="text-gray-500">{fullText}</span>{" "}
            {linkHref ? (
              <a className="font-medium text-gray-900" href={linkHref}>
                {linkTitle}
              </a>
            ) : (
              <span className="font-medium text-gray-900">{linkTitle}</span>
            )}{" "}
            <span className="text-xs text-gray-500">
              {`at ${new Date(activity.timestamp).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}`}
            </span>
          </p>
          <div className="my-1">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              {activityTarget === "dataset" ? (
                <span className="flex items-center gap-1">
                  <Database size={12} color={color} />
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Building size={12} color={color} />
                </span>
              )}

              {activityTarget === "dataset" && (
                <>
                  <span className="hidden xl:block">•</span>
                  {activity.data?.package?.private ? (
                    <span className="flex items-center gap-1">
                      <EyeOff size={12} /> private
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Globe size={12} /> public
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <hr></hr>
    </div>
  );
};
