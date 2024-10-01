import logging
log = logging.getLogger(__name__)


def attribute(name):
    def decorator(func):
        func.is_attribute = True
        func.attribute_name = name
        return func
    return decorator


class BaseConverter():
    def __init__(self, data_dict):
        self.data_dict = data_dict

    def get_attributes(self):
        attributes = {}
        for attr_name in dir(self):
            attr = getattr(self, attr_name)
            is_callable = callable(attr)
            has_attr = hasattr(attr, "is_attribute")
            has_attribute_name = hasattr(attr, "attribute_name")
            if is_callable and has_attr and attr.is_attribute and has_attribute_name:
                attribute_name = attr.attribute_name
                attributes[attribute_name] = attr

        return attributes

    def convert(self):
        converted_data_dict = {}
        attributes = self.get_attributes()
        for attribute in attributes:
            converted_data_dict[attribute] = attributes[attribute]()

        return converted_data_dict
