import { format } from "timeago.js";
import { api } from "@utils/api";
import { Activity, Dataset } from "@portaljs/ckan";

export default function ActivityStream() {
  const { data: activities, error: activitiesError } =
    api.user.listDashboardActivities.useQuery();

  const usersIds = new Set((activities ?? []).map((a) => a.user_id));
  const { data: users } = api.user.getUsersByIds.useQuery({
    ids: [...usersIds],
  });

  return (
    <div className="my-10">
      <h2 className="mb-5 text-base font-semibold leading-6">
        Recent activities
      </h2>
      <div className="h-[50vh] w-full overflow-y-scroll">
        {!activitiesError &&
          activities?.map((activity: Activity & { packageData?: Dataset }) => {
            const user = users?.find((u) => u.id === activity.user_id);
            /*
             * Build the text for the activity entry
             *
             */
            let subjectText;
            if (user && !user.sysadmin) {
              subjectText = user.display_name ?? user.fullname ?? user.name;
            } else {
              if (user?.sysadmin) {
                subjectText = "An admin";
              } else {
                subjectText = "A user";
              }
            }

            const activitySegments = activity.activity_type?.split(" ");
            const activityType = activitySegments
              ? activitySegments[0]
              : "changed";
            const activityTarget = activitySegments
              ? activitySegments[1]
              : "entity";

            let actionText = "";
            switch (activityType) {
              case "new":
                actionText = "created a new ";
                break;
              case "changed":
                actionText = "updated the ";
                break;
              case "deleted":
                actionText = "deleted the ";
                break;
              //  TODO: what other activity types are there?
            }

            const fullText = `${subjectText} ${actionText} ${activityTarget}`;

            //  href may vary depending on the entity
            let linkHref = "";
            let linkTitle: string | undefined = "";
            switch (activityTarget) {
              case "package":
                linkHref = `datasets/${activity.packageData?.name}/resources`;
                linkTitle = activity.data?.package?.title;
                break;
              case "organization":
                /* eslint-disable */
                //  @ts-ignore
                linkTitle = activity.data?.group.title;
                linkHref = "/organizations";
                break;
              case "group":
                //  @ts-ignore
                linkTitle = activity.data?.group.title;
                linkHref = "/groups";
                /* eslint-enable */
                break;
            }

            if (activityType == "deleted") {
              //  Unset href if entity was deleted
              linkHref = "";
            }

            return (
              <div key={activity.id}>
                <div className="mb-10 flex flex-row items-start">
                  {activity.user_data?.image_display_url ? (
                    <div className="w-13 rounded-full">
                      <img
                        src={activity.user_data.image_display_url}
                        alt="Profile picture of user"
                      />
                    </div>
                  ) : (
                    <div className="rounded-full bg-secondary p-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-6 w-6 text-white"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                        />
                      </svg>
                    </div>
                  )}
                  <p className="activity-string ml-3 mt-2">
                    {fullText}{" "}
                    {linkHref ? (
                      <a href={linkHref} className={`underline`}>
                        {linkTitle}
                      </a>
                    ) : (
                      <span>{linkTitle}</span>
                    )}{" "}
                    <span className="text-xs">
                      {format(activity.timestamp, "en_US", {
                        relativeDate:
                          Date.now() +
                          new Date().getTimezoneOffset() * 60 * 1000,
                      })}
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
