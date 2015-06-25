from django.contrib.auth.models import User
from taggit.managers import TaggableManager
from django.utils import timezone
from django.db import models
from django.db.models.signals import pre_delete
from django.dispatch.dispatcher import receiver
from django.shortcuts import get_object_or_404


# Create your models here.
class Profile(models.Model):
    owner = models.ForeignKey(User)

    def __unicode__(self):
        return self.username


class Gif(models.Model):
    owner = models.ForeignKey(User)
    url = models.URLField(max_length=400)
    created = models.DateTimeField(default=timezone.now, auto_now=False)
    label = models.CharField(max_length=400, default='', blank=True)
    thumbnail = models.ImageField(upload_to='thumbs', default='')
    tags = TaggableManager()

    def __unicode__(self):
        return self.url


@receiver(pre_delete, sender=Gif)
def user_thumbnail_delete(sender, instance, **kwargs):
    print 'Firing pre-delete signal...'
    g = get_object_or_404(Gif, pk=instance.id)
    storage, path = g.thumbnail.storage, g.thumbnail.path
    storage.delete(path)
