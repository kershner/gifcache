# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0011_auto_20150720_1000'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='profile',
            name='avatar_thumb',
        ),
        migrations.AlterField(
            model_name='profile',
            name='avatar',
            field=models.URLField(default=b'', max_length=400),
        ),
    ]
