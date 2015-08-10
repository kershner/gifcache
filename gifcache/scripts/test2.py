import requests

r = requests.get('http://i.imgur.com/5DK5f0r.gif', allow_redirects=False)
print r.status_code
print r.history