import ckan.plugins.toolkit as tk

from ckanext.activity.subscriptions import _create_package_activity

import logging

log = logging.getLogger(__name__)


def get_subscriptions():
    return {
        tk.signals.action_succeeded: [
            {"sender": "package_update", "receiver": package_changed},
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

    if is_review_action:
        if not result:
            id_ = data_dict["id"]
        elif isinstance(result, str):
            id_ = result
        else:
            id_ = result["id"]

        activity_type = "reviewed"

        _create_package_activity(
            activity_type,
            id_,
            tk.fresh_context(kwargs["context"])
        )
