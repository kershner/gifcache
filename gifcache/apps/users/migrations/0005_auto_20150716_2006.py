# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_auto_20150702_0935'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='profile',
            name='avatar_thumb',
        ),
        migrations.AlterField(
            model_name='profile',
            name='avatar',
            field=models.URLField(default=b'default-user-image.png', max_length=400),
        ),
    ]
