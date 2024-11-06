# Overrides from ckanext-activity

from ckan.plugins import toolkit as tk
from ckan.logic import validate
import ckan.model as model

from ckan.common import config

from ckanext.activity.logic import schema
from ckanext.activity.model import activity as core_model_activity
from ckanext.activity.logic.action import _get_user_permission_labels

from sqlalchemy import text, and_, or_, not_
import datetime
import logging

log = logging.getLogger(__name__)


def dashboard_activity_list(
    user_id: str,
    limit: int,
    offset: int,
    before=None,
    after=None,
    user_permission_labels=None,
    activity_type='',
    action: str = "",
    query: str = ""
):
    q = _dashboard_activity_query(user_id, limit, activity_type, action, query)
    q = _filter_activitites_from_users(q)
    q = _filter_activities_by_permission_labels(
        q, user_permission_labels)

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
        # type: ignore
        q = q.order_by(core_model_activity.Activity.timestamp.desc())

    count = q.count()

    if offset:
        q = q.offset(offset)
    if limit:
        q = q.limit(limit)

    results = q.all()

    # revert result if required
    if revese_order:
        results.reverse()

    return {'results': results, 'count': count}


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
    action = None
    query = None
    activity_type = None

    extras = data_dict.get("__extras")

    if extras:
        action = extras.get("action")
        query = extras.get("query")
        activity_type = extras.get("status", None)

    activity_objects = dashboard_activity_list(
        user_id,
        limit=limit,
        offset=offset,
        before=before,
        after=after,
        user_permission_labels=_get_user_permission_labels(context),
        action=action,
        activity_type=activity_type,
        query=query,
    )

    activity_dicts = core_model_activity.activity_list_dictize(
        activity_objects.get('results'), context
    )

    count = activity_objects.get('count')

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
                    package["approval_requested_by_user_data"] = get_user_name_and_picture(
                        approval_requested_by)

    return {'results': activity_dicts, 'count': count}


def _activities_from_dataset_approval_workflow(user_id, limit, activity_type=None, status=None, query=None):
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
                    text(
                        "data::json->'package'->>'previous_approval_contributors' LIKE '%' || :user_id || '%'")
                ),
                and_(
                    text(
                        "data::json->'package'->>'approval_status' in ('pending', 'rejected')"),
                    text(
                        "data::json->'package'->>'current_approval_contributors' LIKE '%' || :user_id || '%'")
                ),
                text("data::json->'package'->>'owner_org'") == model.Member.group_id,
                and_(model.User.id == user_id, model.User.sysadmin == True)
            )
        )
        .params(user_id=user_id)
    )

    return core_model_activity._activities_limit(
        _filter_by_action_activity_type_and_status(q, activity_type, status, query), limit)


def _dashboard_activity_query(user_id: str, limit: int = 0, activity_type=None, status=None, query=None):
    """Return an SQLAlchemy query for user_id's dashboard activity stream."""
    q1 = _user_activity_query(user_id, limit, activity_type, status, query)
    q2 = _activities_from_everything_followed_by_user_query(
        user_id, limit, activity_type, status, query)
    q3 = _activities_from_dataset_approval_workflow(
        user_id, limit, activity_type, status, query)

    default_query = (
        core_model_activity._activities_union_all(q1, q2)
        .filter(core_model_activity.Activity.activity_type != "reviewed package")
    )

    query_with_approval = core_model_activity._activities_union_all(
        default_query, q3)

    return query_with_approval


def _activities_from_everything_followed_by_user_query(
    user_id: str, limit: int = 0, activity_type=None, status=None, query=None
):
    """Return a query for all activities from everything user_id follows."""
    q1 = _activities_from_users_followed_by_user_query(
        user_id, limit, activity_type, status, query)
    q2 = _activities_from_datasets_followed_by_user_query(
        user_id, limit, activity_type, status, query)
    q3 = _activities_from_groups_followed_by_user_query(
        user_id, limit, activity_type, status, query)
    return _activities_union_all(q1, q2, q3)


def _filter_activitites_from_users(q):
    """
    Adds a filter to an existing query object to avoid activities from users
    defined in :ref:`ckan.hide_activity_from_users` (defaults to the site user)
    """
    users_to_avoid = _activity_stream_get_filtered_users()
    if users_to_avoid:
        q = q.filter(
            core_model_activity.Activity.user_id.notin_(users_to_avoid))

    return q


def _filter_activities_by_permission_labels(
    q,
    user_permission_labels=None,
):
    """Adds a filter to an existing query object to
    exclude package activities based on user permissions.
    """

    # `user_permission_labels` is None when user is sysadmin
    if user_permission_labels is not None:
        # User can access non-package activities since they don't have labels
        q = q.filter(
            or_(
                or_(core_model_activity.Activity.activity_type.is_(None),
                    not_(core_model_activity.Activity.activity_type.endswith("package"))),
                core_model_activity.Activity.permission_labels.op('&&')(
                    user_permission_labels)
            )
        )

    return q


def _activity_stream_get_filtered_users() -> list[str]:
    """
    Get the list of users from the :ref:`ckan.hide_activity_from_users` config
    option and return a list of their ids. If the config is not specified,
    returns the id of the site user.
    """
    users_list = config.get("ckan.hide_activity_from_users")
    if not users_list:

        context = {"ignore_auth": True}
        site_user = tk.get_action("get_site_user")(context, {})
        users_list = [site_user.get("name")]

    return model.User.user_ids_for_name_or_id(users_list)


def _user_activity_query(
        user_id, limit: int, activity_type=None, status=None, query=None):
    """Return an SQLAlchemy query for all activities from or about user_id."""
    q1 = _activities_limit(_activities_from_user_query(
        user_id, activity_type, status, query), limit)
    q2 = _activities_limit(_activities_about_user_query(
        user_id, activity_type, status, query), limit)
    return _activities_union_all(q1, q2)


def _activities_limit(
    q,
    limit: int,
    offset=None,
    revese_order=False,
):
    """
    Return an SQLAlchemy query for all activities at an offset with a limit.

    revese_order:
        if we want the last activities before a date, we must reverse the
        order before limiting.
    """
    if revese_order:
        q = q.order_by(core_model_activity.Activity.timestamp)
    else:
        q = q.order_by(core_model_activity.Activity.timestamp.desc())

    if offset:
        q = q.offset(offset)
    if limit:
        q = q.limit(limit)
    return q


def _activities_from_user_query(user_id, activity_type=None, status=None, query=None):
    """Return an SQLAlchemy query for all activities from user_id."""
    q = model.Session.query(core_model_activity.Activity)
    q = q.filter(core_model_activity.Activity.user_id.in_(_to_list(user_id)))

    return _filter_by_action_activity_type_and_status(q, activity_type, status, query)


def _activities_about_user_query(user_id, activity_type=None, status=None, query=None):
    """Return an SQLAlchemy query for all activities about user_id."""
    q = model.Session.query(core_model_activity.Activity)
    q = q.filter(core_model_activity.Activity.object_id.in_(_to_list(user_id)))

    return _filter_by_action_activity_type_and_status(q, activity_type, status, query)


def _activities_from_datasets_followed_by_user_query(
    user_id: str, limit: int, activity_type=None, status=None, query=None
):
    """Return a query for all activities from datasets that user_id follows."""
    # Get a list of the datasets that the user is following.
    follower_objects = model.UserFollowingDataset.followee_list(user_id)
    if not follower_objects:
        # Return a query with no results.
        return model.Session.query(core_model_activity.Activity).filter(text("0=1"))

    return _activities_limit(
        _package_activity_query(
            [follower.object_id for follower in follower_objects], activity_type, status, query),
        limit)


def _activities_from_users_followed_by_user_query(
    user_id: str, limit: int, activity_type=None, status=None, query=None
):
    """Return a query for all activities from users that user_id follows."""

    # Get a list of the users that the given user is following.
    follower_objects = model.UserFollowingUser.followee_list(user_id)
    if not follower_objects:
        # Return a query with no results.
        return model.Session.query(core_model_activity.Activity).filter(text("0=1"))

    return _user_activity_query(
        [follower.object_id for follower in follower_objects],
        limit, activity_type, status, query)


def _activities_from_groups_followed_by_user_query(
    user_id: str, limit: int, activity_type=None, status=None, query=None
):
    """Return a query for all activities about groups the given user follows.

    Return a query for all activities about the groups the given user follows,
    or about any of the group's datasets. This is the union of
    _group_activity_query(group_id) for each of the groups the user follows.

    """
    # Get a list of the group's that the user is following.
    follower_objects = model.UserFollowingGroup.followee_list(user_id)
    if not follower_objects:
        # Return a query with no results.
        return model.Session.query(core_model_activity.Activity).filter(text("0=1"))

    return _activities_limit(
        _group_activity_query(
            [follower.object_id for follower in follower_objects], activity_type, status, query),
        limit)


def _group_activity_query(group_id, activity_type=None, status=None, query=None):
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

    return _filter_by_action_activity_type_and_status(q, activity_type, status, query)


def _activities_union_all(*qlist):
    """
    Return union of two or more activity queries sorted by timestamp,
    and remove duplicates
    """
    q, *rest = qlist
    for query in rest:
        q = q.union(query)

    return q


def _to_list(vals):
    if isinstance(vals, (list, tuple)):
        return vals
    return [vals]


def _package_activity_query(package_id, activity_type=None, status=None, query=None):
    """Return an SQLAlchemy query for all activities about package_id."""
    q = model.Session.query(core_model_activity.Activity)\
        .filter(core_model_activity.Activity.object_id.in_(_to_list(package_id)))

    return _filter_by_action_activity_type_and_status(q, activity_type, status, query)


def _filter_by_action_activity_type_and_status(q, activity_type=None, status=None, query=None):
    if not activity_type and not status:
        return q

    if activity_type:
        if activity_type == 'organization':
            q = (
                q.filter(core_model_activity.Activity.activity_type.ilike(
                    "%{} organization%".format(status or '').strip()))
            )
        elif activity_type == 'approval':
            q = (
                q.filter(core_model_activity.Activity.activity_type.ilike(
                    "reviewed package"))
            )
        elif activity_type == 'dataset':
            q = (
                q.filter(and_(
                    core_model_activity.Activity.activity_type.ilike(
                        "%{} package%".format(status or '').strip()),
                    core_model_activity.Activity.activity_type.not_ilike(
                        "%reviewed package%")
                )
                )
            )

    if status:
        if status == 'rejected' or status == 'approved' or status == 'pending':
            q = (
                q.filter(and_(
                    core_model_activity.Activity.activity_type.ilike(
                        "reviewed package"),
                    text("data::json->'package'->>'approval_status' ilike :approval_status"))
                    .params(approval_status="%{}%".format(status)
                            )
                )
            )
        else:
            q = (
                q.filter(
                    or_(
                        core_model_activity.Activity.activity_type.ilike(
                            "%{}%".format(status or '')),

                        text(
                            "data::json->'package'->>'approval_status' ilike :approval_status")
                    )
                    .params(approval_status="%{}%".format(status))
                )
            )
    if query:
        q = q.filter(
            or_(
                    (
                        text(
                            "data::json->'package'->>'title' ilike :title")
                        .params(title="%{}%".format(query))
                    ),
                (
                        text(
                            "data::json->'package'->>'name' ilike :title")
                        .params(title="%{}%".format(query))
                    ),
                (
                        text("data::json->>'actor' ilike :autor")
                        .params(autor="%{}%".format(query))
                    ),
                (
                        text(
                            "data::json->'group'->>'title' ilike :title")
                        .params(title="%{}%".format(query))
                    ),
                (
                        text(
                            "data::json->'group'->>'name' ilike :title")
                        .params(title="%{}%".format(query))
                    )
            )
        )

    return q
