from django.db import models


# Create your models here.
class Profile(models.Model):
    name = models.CharField(max_length=200)

    def __unicode__(self):
        return self.name


class Gif(models.Model):
    owner = models.ForeignKey(Profile)
    url = models.CharField(max_length=400)

    def __unicode__(self):
        return self.url