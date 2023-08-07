from algoliasearch_django import algolia_engine


def get_client():
    return algolia_engine.client


def get_index(index_name):
    client = get_client()
    index = client.init_index(index_name)
    return index


def perform_search(query, **kwargs):
    index_name = kwargs.pop("index_name")
    print("index_name", index_name)
    index = get_index(index_name=index_name)
    params = {}
    if "tags" in kwargs:
        tags = kwargs.pop("tags") or []
        if len(tags) > 0:
            params["tagFilters"] = tags
    # TO DO check if available index filters
    index_filters = [f"{k}:{v}" for k, v in kwargs.items()]
    if len(index_filters) > 0:
        params["facetFilters"] = index_filters
    results = index.search(query, params)
    return results
