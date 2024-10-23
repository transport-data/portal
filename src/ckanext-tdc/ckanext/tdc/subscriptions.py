import ckan.plugins.toolkit as tk
import ckan.model as model

from ckanext.activity.subscriptions import _create_package_activity
from ckanext.tdc.logic.action import send_email

import logging

log = logging.getLogger(__name__)


def get_subscriptions():
    return {
        tk.signals.action_succeeded: [
            {"sender": "package_update", "receiver": package_changed},
            {"sender": "package_create", "receiver": package_changed}
        ]
    }


# NOTE this overrides the default activity extension
# signal receiver only for review actions
def package_changed(sender: str, **kwargs):
    for key in ("result", "context", "data_dict"):
        if key not in kwargs:
            log.warning("Activity subscription ignored")
            return

    result = kwargs["result"]
    data_dict = kwargs["data_dict"]
    context = kwargs["context"]

    is_review_action = context.get("is_approval_action", False)
    is_review_action_pending = context.get("is_approval_action_pending", False)

    if is_review_action:
        if not result:
            id_ = data_dict["id"]
        elif isinstance(result, str):
            id_ = result
        else:
            id_ = result["id"]

        # TODO: update activity_type from "reviewed" to
        # "approval status changed", so that it's clear
        # that pending is also a possible acitivity
        activity_type = "reviewed"

        if is_review_action_pending:
            _create_package_activity(
                "new" if sender == "package_create" else "changed",
                id_,
                tk.fresh_context(kwargs["context"])
            )

        _create_package_activity(
            activity_type,
            id_,
            tk.fresh_context(kwargs["context"])
        )

        _notify_approval_action_via_email(context, data_dict)


def _notify_approval_action_via_email(context, data_dict):
    # TODO: what if it's a patch?
    # identify if it's a patch and get the entire package
    approval_status = data_dict.get("approval_status")
    contributors = data_dict.get("contributors", [])

    from_user = None
    if approval_status == "pending":
        approval_requested_by = data_dict.get("approval_requested_by")
        from_user = model.User.get(approval_requested_by)
    else:
        from_user = model.User.get(context["user"])

    owner_org = data_dict.get("owner_org")
    owner_org_dict = model.Group.get(owner_org)

    member_list_action = tk.get_action("member_list")
    member_list_data_dict = {"capacity": "admin", "id": owner_org}
    privileged_context = {"ignore_auth": True}
    member_list = member_list_action(privileged_context, member_list_data_dict)
    member_id_list = [member[0] for member in member_list]

    # Send emails to all contributors and admins
    user_id_list = list(set(contributors + member_id_list))

    feedback = data_dict.get("approval_message")

    from_user_name = from_user.fullname
    if not from_user_name or from_user_name == "":
        from_user_name = from_user.name

    for id in user_id_list:
        user = model.User.get(id)

        user_is_admin = id in member_id_list 
        user_is_contributor = id in contributors

        reason = ""
        if user_is_admin:
            reason = "You are receiving this notification because you have the permission to approve or reject datasets in this organization."
        elif user_is_contributor:
            reason = "You are receiving this notification because you are one of the contributors of the dataset."

        frontend_url = tk.config.get('ckan.frontend_portal_url', None)
        site_url = "{}/dashboard/datasets-approvals".format(frontend_url)

        send_email(
            "dataset_approval_{}".format(approval_status),
            user.email,
            from_user,
            site_url=site_url,
            org_title=owner_org_dict.title,
            dataset_title=data_dict.get("title"),
            reason=reason,
            feedback=feedback
        )
