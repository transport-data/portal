import ckan.logic.schema as schema
import ckan.lib.navl.dictization_functions as df

import logging

log = logging.getLogger(__name__)


@schema.validator_args
def dataset_approval_schema(not_empty):
    def approval_status_validator(key, data, errors, context):
        value = data.get(key)

        if value in ["approved", "rejected"]:
            return

        errors[key].append("Status must be either status, rejected or pending")
        raise df.StopOnError

    def approval_feedback_validator(key, data, errors, context):
        status = data[key[:-1] + ('status',)]

        if not status or status != "rejected":
            return

        return not_empty(key, data, errors, context)

    schema = {
            "id": [not_empty],
            "status": [not_empty, approval_status_validator],
            "feedback": [approval_feedback_validator]
            }
    return schema
