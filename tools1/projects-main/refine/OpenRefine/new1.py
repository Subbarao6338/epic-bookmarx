'''import requests

url = 'https://docs.openrefine.org/technical-reference/openrefine-api'
headers = {'Accept': 'application/json'}
response = requests.get(url, headers=headers)

outf=open('file.htmlhtml', 'wb')
outf.write(response.content)
'''
from urllib.parse import urlsplit, urlunsplit
import urllib.request
url = list(urlsplit('http://127.0.0.1:3333/command/core/get-history?project=2174100887778'))
print(url)
url[3] = 'project=1858937637244'
new_url = urlunsplit(url)
print(new_url)
history = urllib.request.urlopen(new_url)
print("History of Project \n", history.read())
'''
import urllib.parse
parsed = urllib.parse.urlparse("http://127.0.0.1:3333/command/core/get-history?project=2174100887778")
replaced = parsed._replace(query='project=1858937637244')
print(replaced)'''


