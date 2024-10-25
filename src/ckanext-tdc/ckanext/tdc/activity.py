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


def _filter_activities(activity_type=None, status=None):
    if not activity_type and not status:
        return None

    if activity_type:
        if activity_type == 'organization':
            q = (
                model.Session.query(core_model_activity.Activity)
                .filter(core_model_activity.Activity.activity_type.ilike("%{} organization%".format(status or '').strip()))
            )
        elif activity_type == 'approval':
            q = (
                model.Session.query(core_model_activity.Activity)
                .filter(core_model_activity.Activity.activity_type.ilike("reviewed package"))
            )
            if status is not None:
                q = (
                    q.filter(
                        text("data::json->'package'->>'approval_status' ilike :approval_status"))
                    .params(approval_status="%{}%".format(status))
                )
        elif activity_type == 'dataset':
            q = (
                model.Session.query(core_model_activity.Activity)
                .filter(and_(
                        core_model_activity.Activity.activity_type.ilike(
                            "%{} package%".format(status or '').strip()),
                        core_model_activity.Activity.activity_type.not_ilike(
                            "%reviewed package%")
                        )
                        )
            )
    elif status:
        q = (
            model.Session.query(core_model_activity.Activity)
            .filter(
                or_(
                    core_model_activity.Activity.activity_type.ilike("%{}%".format(status or ''))),
                text("data::json->'package'->>'approval_status' ilike :approval_status")
                .params(approval_status="%{}%".format(status))
            )
        )

    return q


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
    q = core_model_activity._dashboard_activity_query(user_id)
    q = core_model_activity._filter_activitites_from_users(q)
    q = core_model_activity._filter_activities_by_permission_labels(
        q, user_permission_labels)

    if activity_type or action:
        q = core_model_activity._activities_union_all(
            core_model_activity._activities_limit(
                _filter_activities(activity_type, action), limit, offset),
            q
        )

    if query:
        q = core_model_activity._activities_union_all(
            core_model_activity._activities_limit(
                (
                    model.Session.query(core_model_activity.Activity)
                    .filter(
                        and_(
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
                    )
                ), limit, offset),
            q
        )

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
