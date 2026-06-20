from Column_Classifications.entity import get_entity_by_guid, get_entity_by_qualified_name


def get_entity_classification(guid):
    data = get_entity_by_guid(guid)
    classifications = [classification["typeName"] for classification in data["entity"]["classifications"]]
    return classifications


def get_csv_schema_classifications(guid=None, type_name=None, qualified_name=None):
    if guid:
        data = get_entity_by_guid(guid)
    else:
        data = get_entity_by_qualified_name(type_name=type_name, qualified_name=qualified_name)

    tabular_schema_guid = data["entity"]["relationshipAttributes"]['tabular_schema']['guid']
    data = get_entity_by_guid(tabular_schema_guid)
    referred_entities = data["referredEntities"]
    columns = data["entity"]["relationshipAttributes"]["columns"]
    schema_classification = [{"column": column['displayText'],
                              "classifications": [classification["typeName"] for classification in
                                                  referred_entities[column["guid"]].get("classifications", [])]} for
                             column in columns]
    return {"data": schema_classification}


def get_sql_column_classification(guid=None, type_name=None, qualified_name=None):
    if guid:
        data = get_entity_by_guid(guid)
    else:
        data = get_entity_by_qualified_name(type_name=type_name, qualified_name=qualified_name)

    columns = data["entity"]["relationshipAttributes"]["columns"]
    referred_entities = data["referredEntities"]
    column_classification = [{"column": column['displayText'],
                              "classifications": [classification["typeName"] for classification in
                                                  referred_entities[column["guid"]].get("classifications", [])]} for
                             column in columns]
    return {"data": column_classification}
