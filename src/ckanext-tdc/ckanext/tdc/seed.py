import json
import logging
import os.path as path

import ckan.model as model
import ckan.plugins.toolkit as tk
from ckan.types import Context
from werkzeug.datastructures import FileStorage

log = logging.getLogger(__name__)


def seed_default_topics():
    existing_topics_count = model.Group.all(group_type='topic').count()

    # Only run if the instance has no topics
    if existing_topics_count == 0:
        cwd = path.abspath(path.dirname(__file__))
        base_path = path.join(cwd, "assets/topics")
        filepath = path.join(base_path, "topics.json")
        log.info("Loading topics")
        try:
            topics = None
            with open(filepath) as f:
                topics = json.load(f)

            get_site_user_action = tk.get_action("get_site_user")
            site_user = get_site_user_action({"ignore_auth": True}, {})

            group_create_action = tk.get_action("group_create")

            for topic in topics:
                privileged_context = Context({
                    "ignore_auth": True,
                    "user": site_user["name"],
                    "model": model
                })
                image_file = topic.pop("image_url")
                local_image_path = path.join(base_path, image_file)
                image_bytes = None
                with open(local_image_path, "rb") as image_f:
                    image_bytes = FileStorage(image_f)
                    image_bytes.filename = image_file
                    topic["image_upload"] = image_bytes
                    new_topic = group_create_action(privileged_context, topic)
                log.info("Created %s" % new_topic.get("name"))
        except Exception as e:
            log.error("Failed to seed topics")
            log.error(e)
            clean_topics()


def clean_topics():
    privileged_context = {"ignore_auth": True}
    get_site_user_action = tk.get_action("get_site_user")
    site_user = get_site_user_action(privileged_context, {})
    privileged_context["user"] = site_user["name"]
    group_delete_action = tk.get_action("group_delete")
    group_purge_action = tk.get_action("group_purge")
    topics_list = model.Group.all(
        group_type='topic', state=('active', 'deleted')).all()
    try:
        for topic in topics_list:
            group_delete_action(privileged_context, {"id": topic.id})
            group_purge_action(privileged_context, {"id": topic.id})
            log.info("Deleted %s" % topic.name)
    except Exception as e:
        log.error("Failed to delete")
        log.error(e)
