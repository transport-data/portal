# Overrides from ckanext-activity

from ckanext.activity.logic import schema
from ckan.plugins import toolkit as tk
from ckan.logic import validate
from ckanext.activity.model import activity as core_model_activity
from ckanext.activity.logic.action import _get_user_permission_labels
import ckan.model as model

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


def _dashboard_activity_query(user_id: str, limit: int = 0):
    q1 = core_model_activity._user_activity_query(user_id, limit)
    q2 = _activities_from_everything_followed_by_user_query(user_id, limit)
    return core_model_activity._activities_union_all(q1, q2)


def dashboard_activity_list(
    user_id: str,
    limit: int,
    offset: int,
    before=None,
    after=None,
    user_permission_labels=None,
):
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
    activity_objects = dashboard_activity_list(
        user_id,
        limit=limit,
        offset=offset,
        before=before,
        after=after,
        user_permission_labels=_get_user_permission_labels(context)
    )

    activity_dicts = core_model_activity.activity_list_dictize(
        activity_objects, context
    )

    # Mark the new (not yet seen by user) activities.
    strptime = datetime.datetime.strptime
    fmt = "%Y-%m-%dT%H:%M:%S.%f"
    dashboard = model.Dashboard.get(user_id)
    last_viewed = None
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

    return activity_dicts
