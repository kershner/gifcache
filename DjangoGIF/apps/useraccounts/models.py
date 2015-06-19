from django.contrib.auth.models import User
from taggit.managers import TaggableManager
from django.utils import timezone
from django.db import models


# Create your models here.
class Profile(models.Model):
    owner = models.ForeignKey(User)

    def __unicode__(self):
        return self.username


class Gif(models.Model):
    owner = models.ForeignKey(User)
    url = models.CharField(max_length=400)
    created = models.DateTimeField(default=timezone.now)
    label = models.CharField(max_length=400, default='', blank=True)
    tags = TaggableManager()
    tag_names = models.CharField(max_length=400, default='', blank=True)

    def __unicode__(self):
        return self.url