import urllib.request
from urllib.parse import urlparse, urlsplit, urlunsplit

# URL parsing
url = 'http://127.0.0.1:3333/command/core/get-history?project=2174100887778'
r = urlparse(url)
print(r)

# Replace Url contents
url1 = list(urlsplit('http://127.0.0.1:3333/command/core/get-history?project=2174100887778'))
print(url1)
url1[3] = 'project=1858937637244'
new_url = urlunsplit(url1)
print(new_url)


# History of project
history = urllib.request.urlopen("http://127.0.0.1:3333/command/core/get-history?project=2174100887778")
print("History of Project \n", history.read())
print("result code: " + str(history.getcode()))

# Get Models of project
models = urllib.request.urlopen("http://127.0.0.1:3333/command/core/get-models?project=2174100887778")
print("Models of Project \n", models.read())

# Metadata of all projects
metall = urllib.request.urlopen("http://127.0.0.1:3333/command/core/get-all-project-metadata")
print("Metadata of all projects \n", metall.read())

# Metadata of a project
meta = urllib.request.urlopen("http://127.0.0.1:3333/command/core/get-project-metadata?project=2174100887778")
print("Metadata of a Project \n", meta.read())

# CSRF Token
csrf = urllib.request.urlopen("http://127.0.0.1:3333/command/core/get-csrf-token")
print("CSRF Token \n", csrf.read())

# Get Rows
getrows = urllib.request.urlopen("http://127.0.0.1:3333/command/core/get-rows?project=2174100887778")
print("Get Rows \n", getrows.read())

# Tags Of Projects
tag = urllib.request.urlopen("http://127.0.0.1:3333/command/core/get-all-project-tags")
print("Tags of projects \n", tag.read())

# Version
ver = urllib.request.urlopen("http://127.0.0.1:3333/command/core/get-version")
print("Version \n", ver.read())

# Saved Connections
con = urllib.request.urlopen("http://127.0.0.1:3333/command/database/saved-connection")
print("Saved Connections \n", con.read())

# Languages
lang = urllib.request.urlopen("http://127.0.0.1:3333/command/core/get-languages")
print("Languages \n", lang.read())


'''# Home
home = urllib.request.urlopen("http://127.0.0.1:3333")
print("Home \n", home.read())'''

'''# Create Project
create = urllib.request.urlopen("http://127.0.0.1:3333/command/core/create-project-from-upload&duplicates.csv")
print(" Create project \n", create.read())
print ("result code: " + str(create.getcode()))

# Export Rows
getrows = urllib.request.urlopen("http://127.0.0.1:3333/command/core/export-rows/duplicates.csv")
print("Get Rows \n", getrows.read())

# Delete Project
delete = urllib.request.urlopen("http://127.0.0.1:3333/command/core/delete-project?project=2084226911178")
print("Delete project \n", delete.read())'''
