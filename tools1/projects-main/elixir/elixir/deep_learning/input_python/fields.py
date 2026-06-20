def getfields():
	FIELDS = dict()
	FIELD_TYPES = {"general": 0, "optional": 1, "amount": 2, "date": 3}
	FIELDS["ip_address"] = FIELD_TYPES["general"]
	FIELDS["log_date"] = FIELD_TYPES["general"]
	return FIELDS
if __name__ == '__main__':
	getfields()