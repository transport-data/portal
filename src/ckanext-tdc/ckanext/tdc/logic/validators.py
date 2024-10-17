import ckan.plugins.toolkit as tk
import ckanext.activity.logic.validators as core_activity_validators

import logging

log = logging.getLogger(__name__)


# NOTE: overrides from ckanext-actity
def activity_type_exists(activity_type):
    """Raises Invalid if there is no registered activity renderer for the
    given activity_type. Otherwise returns the given activity_type.

    This just uses object_id_validators as a lookup.
    very safe.

    """
    log.error("!@#!@#")
    log.error(object_id_validators)
    if activity_type in object_id_validators:
        return activity_type
    else:
        raise tk.Invalid("%s: %s" % (tk._("Not found"), tk._("Activity type")))


object_id_validators = {
    **core_activity_validators.object_id_validators,
    "reviewed package": "package_id_exists"
}


def object_id_validator(
    key,
    activity_dict,
    errors,
    context,
):
    activity_type = activity_dict[("activity_type",)]
    if activity_type in object_id_validators:
        object_id = activity_dict[("object_id",)]
        name = object_id_validators[activity_type]
        validator = tk.get_validator(name)
        return validator(object_id, context)
    else:
        raise tk.Invalid(
            'There is no object_id validator for activity type "%s"'
            % activity_type
        )
