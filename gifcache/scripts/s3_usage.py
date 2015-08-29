from boto.s3.connection import S3Connection, Bucket
import settings


def bytes_to(bytes_num, to, bsize=1024):
    """convert bytes to megabytes, etc.
       sample code:
           print('mb= ' + str(bytes_to(314575262000000, 'm')))
       sample output:
           mb= 300002347.946
    """
    a = {'k': 1, 'm': 2, 'g': 3, 't': 4, 'p': 5, 'e': 6}
    r = float(bytes_num)
    for i in range(a[to]):
        r /= bsize

    return r

s3conn = S3Connection(settings.AWS_ACCESS_KEY_ID, settings.AWS_SECRET_ACCESS_KEY)
bucket = Bucket(s3conn, settings.AWS_STORAGE_BUCKET_NAME)
total_bytes = 0
keys = []
for key in bucket:
    keys.append(key)
    total_bytes += key.size
print 'Size: %.2f MB' % float(str(bytes_to(total_bytes, 'm')))
print 'Number of Thumbs: ' + str(len(keys))
