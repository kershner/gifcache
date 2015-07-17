from django.db.models.signals import pre_delete, post_save
from boto.s3.connection import S3Connection, Bucket, Key
from django.dispatch.dispatcher import receiver
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from taggit.managers import TaggableManager
from django.utils import timezone
from django.conf import settings
from django.db import models


# Create your models here.
class Profile(models.Model):
    owner = models.ForeignKey(User)
    avatar = models.URLField(max_length=400, default='/static/img/default-user-image.png')
    avatar_thumb = models.ImageField(upload_to='avatars', default='/static/img/default-user-image.png')

    def __unicode__(self):
        return self.owner.username


class Gif(models.Model):
    owner = models.ForeignKey(User)
    url = models.URLField(max_length=400)
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
        print 'Creating user profile...'
        u = get_object_or_404(User, pk=instance.id)
        p = Profile(owner=u)
        p.save()


# Signal to delete associated thumbnail media from Amazon S3 when user deletes a GIF
@receiver(pre_delete, sender=Gif)
def user_thumbnail_delete(sender, instance, **kwargs):
    print 'Firing pre-delete signal...'
    g = get_object_or_404(Gif, pk=instance.id)
    filename = str(g.thumbnail)
    filename = filename[filename.find('/') + 1:]
    s3conn = S3Connection(settings.AWS_ACCESS_KEY_ID, settings.AWS_SECRET_ACCESS_KEY)
    bucket = Bucket(s3conn, settings.AWS_STORAGE_BUCKET_NAME)
    k = Key(bucket)
    k.key = 'thumbs/' + filename
    bucket.delete_key(k.key)