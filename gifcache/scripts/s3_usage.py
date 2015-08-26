from boto.s3.connection import S3Connection, Bucket, Key
import settings

s3conn = S3Connection(settings.AWS_ACCESS_KEY_ID, settings.AWS_SECRET_ACCESS_KEY)
bucket = Bucket(s3conn, settings.AWS_STORAGE_BUCKET_NAME)
total_bytes = 0
keys = []
for key in bucket:
    keys.append(key)
    total_bytes += key.size
print 'Size: ' + str(total_bytes) + ' bytes'
print 'Number of Thumbs: ' + str(len(keys))