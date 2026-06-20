import requests

url = 'http://127.0.0.1:3333/command/core/get-all-project-metadata'
headers = {'Accept': 'application/json'}
response = requests.get(url, headers=headers)

outf = open('outputfile.json', 'wb')
outf.write(response.content)
