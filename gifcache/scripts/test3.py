import requests

r = requests.get('http://gfycat.com/cajax/get/ScaryGrizzledComet').json()['gfyItem']
print r['mp4Url']