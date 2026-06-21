def generate_kusto_query(table, fields, joins=None, filters=None):
    query = f"{table}\n| project {fields}"
    if filters:
        query += f"\n| where {filters}"
    if joins:
        query += f"\n| join ({joins}) on id"
    return query
