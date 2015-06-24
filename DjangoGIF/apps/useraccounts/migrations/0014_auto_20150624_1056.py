# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('useraccounts', '0013_auto_20150623_2137'),
    ]

    operations = [
        migrations.AlterField(
            model_name='gif',
            name='url',
            field=models.URLField(max_length=400),
        ),
    ]
