from django.db.models.signals import pre_delete, post_save
from boto.s3.connection import S3Connection, Bucket, Key
from django.dispatch.dispatcher import receiver
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from taggit.managers import TaggableManager
from django.utils import timezone
from django.conf import settings
from django.db import models
import logging

# Log everything, and send it to stderr.
logging.basicConfig(level=logging.DEBUG)


# Create your models here.
class Profile(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL)
    avatar = models.URLField(max_length=400, default='')

    def __unicode__(self):
        return self.owner.username


class Gif(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL)
    url = models.URLField(max_length=400)
    display_url = models.URLField(max_length=400, default='')
    created = models.DateTimeField(default=timezone.now, auto_now=False)
    label = models.CharField(max_length=400, default='', blank=True)
    thumbnail = models.ImageField(upload_to='thumbs', default='')
    tags = TaggableManager()

    def __unicode__(self):
        return self.url


# Signal to create user profile once registration process completes
@receiver(post_save, sender=User)
def create_profile(sender, created, instance, **kwargs):
    if created:
        logging.debug('Creating user profile...')
        Profile.objects.create(owner=instance)


# Signal to delete associated thumbnail media from Amazon S3 when user deletes a GIF
@receiver(pre_delete, sender=Gif)
def user_thumbnail_delete(sender, instance, **kwargs):
    logging.debug('Firing pre-delete signal...')
    gif = get_object_or_404(Gif, pk=instance.id)
    f = str(gif.thumbnail)
    filename = f[f.rfind('/') + 1:]
    s3conn = S3Connection(settings.AWS_ACCESS_KEY_ID, settings.AWS_SECRET_ACCESS_KEY)
    bucket = Bucket(s3conn, settings.AWS_STORAGE_BUCKET_NAME)
    key_obj = Key(bucket)
    key_obj.key = 'thumbs/' + filename
    bucket.delete_key(key_obj.key)