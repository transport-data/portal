import { api } from "@utils/api";
import { EyeOff, Globe, Building, Database, User } from "lucide-react";
import { useSession } from "next-auth/react";

export interface DashboardNewsfeedCardProps {
  id: string;
  timestamp: string;
  user_id: string;
  object_id?: string;
  activity_type?: string;
  data?: {
    group?: {
      title?: string;
      state?: string;
    };
    package?: {
      name?: string;
      title?: string;
      private?: boolean;
      state?: string;
    };
    actor?: string;
  };
}

export default (activity: DashboardNewsfeedCardProps) => {
  const { data: sessionData } = useSession();
  const user_id = sessionData?.user?.id;

  const { data: user, isLoading } = api.user.getUsersByIds.useQuery({
    ids: [activity.user_id],
  });
  const userData = user?.at(0);
  console.log(activity)
  console.log(userData)

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

  let actor = ""
  if (activity.user_id == user_id) {
      actor = "You"
  } else if (activity?.data?.actor) {
      actor = activity.data.actor
  } else if (userData?.fullname) {
      actor = userData.fullname
  } else if (userData?.display_name) {
      actor = userData.display_name
  } else if (userData?.name) {
      actor = userData.name
  }

  let linkHref = "";
  let linkTitle: string | undefined = "";
  switch (activityTarget) {
    case "dataset":
      linkHref = `datasets/${activity.data?.package?.name}/resources`;
      linkTitle = activity.data?.package?.title;
      actor =
        activity.user_id == user_id
          ? "You"
          : activity.data?.actor
            ? activity.data?.actor
            : "You";
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
  const fullText = `${actionText} ${activityTarget}`;

  if (activityType == "deleted") {
    //  Unset href if entity was deleted
    linkHref = "";
  }
  return (
    <div key={activity.id}>
      <div className="my-5 flex flex-row items-start">
        <div className="mr-3 h-12 w-12 overflow-hidden rounded-full bg-gray-100">
          {userData && userData.image_display_url ? (
            <img
              src={userData.image_display_url}
              alt="Profile picture of user"
              className="h-12 w-12 object-cover"
            />
          ) : (
            <User className="mx-auto h-12 h-12" />
          )}
        </div>
        <div>
          <p className="text-base">
            <span className="font-medium text-gray-900">{actor}</span> <span className="text-gray-500">{fullText}</span>{" "}
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
