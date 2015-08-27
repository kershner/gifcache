from cStringIO import StringIO
from PIL import Image
import requests

counter = 2
size = (500, 500)
for x in range(6):
    url = 'http://www.gifcache.com/static/img/gifcache_gif%d.gif' % counter
    img = requests.get(url)
    img = StringIO(img.content)
    img_file = Image.open(img).convert('RGB').resize(size)
    img_file.thumbnail(size, Image.ANTIALIAS)
    img_temp = StringIO()
    img_file.save('gifcache_thumbnail%d' % counter, 'PNG')
    counter += 1