from ckan.types import Context, DataDict, ErrorDict, Schema
from ckan.types.logic import ActionResult
from ckan.plugins import toolkit as tk

@tk.chained_action
def package_delete(up_func, context, data_dict):
    package_search = tk.get_action('package_search')
    search_result = package_search(context, {'fq': f'related_datasets:({data_dict["id"]})'})
    print(search_result, flush=True)
    #result = up_func(context, data_dict)
    #return result
