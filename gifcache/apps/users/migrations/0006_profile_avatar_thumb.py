# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_auto_20150716_2006'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='avatar_thumb',
            field=models.ImageField(default=b'default-user-image.png', upload_to=b'avatars'),
        ),
    ]
