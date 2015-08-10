import requests

urls = [
    'http://i.imgur.com/q5bSI3P.gifv'
]
test = 'image/png'
for url in urls:
    r = requests.get(url)
    print r.headers['Content-length']
