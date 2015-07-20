# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0009_auto_20150717_1517'),
    ]

    operations = [
        migrations.AddField(
            model_name='gif',
            name='formatted_url',
            field=models.URLField(default=b'', max_length=400),
        ),
    ]
