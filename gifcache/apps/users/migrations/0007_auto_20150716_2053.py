# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_profile_avatar_thumb'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='avatar',
            field=models.URLField(default=b'https://gifcache.s3.amazonaws.com/avatars/default-user-image.png', max_length=400),
        ),
        migrations.AlterField(
            model_name='profile',
            name='avatar_thumb',
            field=models.ImageField(default=b'https://gifcache.s3.amazonaws.com/avatars/default-user-image.png', upload_to=b'avatars'),
        ),
    ]
