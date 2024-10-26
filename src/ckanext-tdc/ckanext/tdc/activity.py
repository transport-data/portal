# Overrides from ckanext-activity

from ckan.plugins import toolkit as tk
from ckan.logic import validate
import ckan.model as model

from ckanext.activity.logic import schema
from ckanext.activity.model import activity as core_model_activity
from ckanext.activity.logic.action import _get_user_permission_labels

from sqlalchemy import text, and_, or_
import datetime
import logging

log = logging.getLogger(__name__)


def _group_activity_query(group_id):
    groups = core_model_activity._to_list(group_id)
    q = (
        model.Session.query(core_model_activity.Activity)
        .outerjoin(model.Member, core_model_activity.Activity.object_id == model.Member.table_id)
        .outerjoin(model.Group, core_model_activity.Activity.object_id == model.Group.id)
        .outerjoin(
            model.Package,
            and_(
                model.Package.id == model.Member.table_id,
                model.Package.private == False,  # noqa
            ),
        )
        .filter(
            or_(
                # active dataset in the group
                and_(
                    model.Member.group_id.in_(groups),
                    model.Member.state == "active",
                    model.Package.state == "active",
                ),
                # deleted dataset in the group
                and_(
                    model.Member.group_id.in_(groups),
                    model.Member.state == "deleted",
                    model.Package.state == "deleted",
                ),
                # (we want to avoid showing changes to an active dataset that
                # was once in this group)
                # activity the the group itself
                and_(
                    core_model_activity.Activity.object_id.in_(groups),
                    or_(
                        model.Group.id is None,
                        model.Group.type != "geography"
                    )
                ),
            )
        )
    )

    return q


def _activities_from_groups_followed_by_user_query(
    user_id: str, limit: int
):
    # Get a list of the group's that the user is following.
    follower_objects = model.UserFollowingGroup.followee_list(user_id)
    if not follower_objects:
        # Return a query with no results.
        return model.Session.query(core_model_activity.Activity).filter(text("0=1"))

    return core_model_activity._activities_limit(
        _group_activity_query(
            [follower.object_id for follower in follower_objects]),
        limit)


def _activities_from_everything_followed_by_user_query(
    user_id: str, limit: int = 0
):
    q1 = core_model_activity._activities_from_users_followed_by_user_query(user_id, limit)
    q2 = core_model_activity._activities_from_datasets_followed_by_user_query(user_id, limit)
    q3 = _activities_from_groups_followed_by_user_query(user_id, limit)
    return core_model_activity._activities_union_all(q1, q2, q3)


def _activities_from_dataset_approval_workflow(user_id, limit, approval_status=None):
    # The user that will receive this notification is the
    # user that triggered the approval request
    q = (
            model.Session.query(core_model_activity.Activity)
            .outerjoin(model.User, model.User.id == user_id)
            .outerjoin(model.Member, and_(
                model.Member.capacity == "admin",
                model.Member.table_name == "user",
                model.Member.table_id == user_id
            ))
            .filter(core_model_activity.Activity.activity_type == "reviewed package")
            .filter(
                or_(
                    text("data::json->'package'->>'approval_requested_by' = :user_id"),
                    and_(
                        text("data::json->'package'->>'approval_status' = 'approved'"),
                        text("data::json->'package'->>'previous_approval_contributors' LIKE '%' || :user_id || '%'")
                    ),
                    and_(
                        text("data::json->'package'->>'approval_status' in ('pending', 'rejected')"),
                        text("data::json->'package'->>'current_approval_contributors' LIKE '%' || :user_id || '%'")
                    ),
                    text("data::json->'package'->>'owner_org'") == model.Member.group_id,
                    and_(model.User.id == user_id, model.User.sysadmin == True)
                )
            )
            .params(user_id=user_id)
    )

    log.error(q)

    if approval_status is not None:
        q = (
            q.filter(text("data::json->'package'->>'approval_status' = :approval_status"))
            .params(approval_status=approval_status)
        )

    return core_model_activity._activities_limit(q, limit)


def _dashboard_approval_activity_query(user_id: str, limit: int = 0, approval_status=None):
    q1 = _activities_from_dataset_approval_workflow(user_id, limit, approval_status=approval_status)

    return core_model_activity._activities_union_all(q1)


def _dashboard_activity_query(user_id: str, limit: int = 0):
    q1 = core_model_activity._user_activity_query(user_id, limit)
    q2 = _activities_from_everything_followed_by_user_query(user_id, limit)
    q3 = _activities_from_dataset_approval_workflow(user_id, limit)

    default_query = (
        core_model_activity._activities_union_all(q1, q2)
        .filter(core_model_activity.Activity.activity_type != "reviewed package")
    )

    query_with_approval = core_model_activity._activities_union_all(default_query, q3)

    return query_with_approval


def dashboard_activity_list(
    user_id: str,
    limit: int,
    offset: int,
    before=None,
    after=None,
    user_permission_labels=None,
    mode="newsfeed",
    approval_status=None
):

    if mode == "approval":
        q = _dashboard_approval_activity_query(user_id, approval_status=approval_status)
    else:
        q = _dashboard_activity_query(user_id)

    q = core_model_activity._filter_activitites_from_users(q)

    q = core_model_activity._filter_activities_by_permission_labels(q, user_permission_labels)

    if after:
        q = q.filter(core_model_activity.Activity.timestamp > after)
    if before:
        q = q.filter(core_model_activity.Activity.timestamp < before)

    # revert sort queries for "only before" queries
    revese_order = after and not before
    if revese_order:
        q = q.order_by(core_model_activity.Activity.timestamp)
    else:
        # type_ignore_reason: incomplete SQLAlchemy types
        q = q.order_by(core_model_activity.Activity.timestamp.desc())  # type: ignore

    if offset:
        q = q.offset(offset)
    if limit:
        q = q.limit(limit)

    results = q.all()

    # revert result if required
    if revese_order:
        results.reverse()

    return results


@validate(schema.default_dashboard_activity_list_schema)
@tk.side_effect_free
def dashboard_activity_list_action(
    context,
    data_dict
):
    tk.check_access("dashboard_activity_list", context, data_dict)
    model = context["model"]
    user_obj = model.User.get(context["user"])
    assert user_obj
    user_id = user_obj.id
    offset = data_dict.get("offset", 0)
    limit = data_dict["limit"]  # defaulted, limited & made an int by schema
    before = data_dict.get("before")
    after = data_dict.get("after")

    mode = "newsfeed"
    approval_status = None
    extras = data_dict.get("__extras")
    if extras:
        mode = extras.get("mode", "newsfeed")
        approval_status = extras.get("approval_status", None)

    activity_objects = dashboard_activity_list(
        user_id,
        limit=limit,
        offset=offset,
        before=before,
        after=after,
        user_permission_labels=_get_user_permission_labels(context),
        mode=mode,
        approval_status=approval_status
    )

    activity_dicts = core_model_activity.activity_list_dictize(
        activity_objects, context
    )

    # Mark the new (not yet seen by user) activities.
    strptime = datetime.datetime.strptime
    fmt = "%Y-%m-%dT%H:%M:%S.%f"
    dashboard = model.Dashboard.get(user_id)
    last_viewed = None

    cached_users_data = {}

    def get_user_name_and_picture(user_id):
        if user_id in cached_users_data:
            return cached_users_data[user_id]

        user = model.Session.query(
            model.User
        ).get(user_id)

        name = user.fullname
        if not name or name == "":
            name = user.name
        if not name or name == "":
            name = None

        display_image = user.image_url

        user_data = {
            "name": name,
            "display_image": display_image
        }

        cached_users_data[user_id] = user_data
        return name

    if dashboard:
        last_viewed = dashboard.activity_stream_last_viewed
    for activity in activity_dicts:
        if activity["user_id"] == user_id:
            # Never mark the user's own activities as new.
            activity["is_new"] = False
        elif last_viewed:
            activity["is_new"] = (
                strptime(activity["timestamp"], fmt) > last_viewed
            )

        user_id = activity.get("user_id", False)

        if user_id:
            activity["user_data"] = get_user_name_and_picture(user_id)

        if activity["activity_type"] == "reviewed package" and "data" in activity:
            data = activity["data"]
            if "package" in data:
                package = data["package"]
                approval_requested_by = package.get("approval_requested_by")
                if approval_requested_by:
                    package["approval_requested_by_user_data"] = get_user_name_and_picture(approval_requested_by)

    return activity_dicts
