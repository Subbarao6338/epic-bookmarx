// # Allows Charactor , Numbers and Some Special Characters Like '_ - .'
export const name_title = '^(?!\\d+$)(?:[a-zA-Z0-9][a-zA-Z0-9 ._-]*){3,50}?$'
export const website = '^((https?|ftp|smtp):\\/\\/)?(www.)?[a-z0-9]+\\.[a-z]+(\\/[a-zA-Z0-9#]+\\/?)*$'


//export const azure_sql_server = '^(?!\\d+$)(?:[a-zA-Z0-9][a-zA-Z0-9 .]*){3,100}?$'
//export const azure_sql_db = '[0-9a-zA-Z$_]+{3,50}'
//export const azure_sql_username = '[0-9a-zA-Z$_]+{3,100}'
//export const azure_sql_password = '^((?=.*[A-Z])(?=.*\\d)(?=.*[~`!@#$%^&*()\\-_+={[}\\]|\\:;"\'<,>.?\\/])|(?=.*[a-z])(?=.*\\d)(?=.*[~`!@#$%^&*()\\-_+={[}\\]|\\:;"\'<,>.?\\/])|(?=.*[a-z])(?=.*\\d)(?=.*[A-Z])|(?=.*[a-z])(?=.*[~`!@#$%^&*()\\-_+={[}\\]|\\:;"\'<,>.?\\/])(?=.*[A-Z]))[\\w~`!@#$%^&*()\\-+={[}\\]|\\:;"\'<,>.?\\/]{8,128}$'