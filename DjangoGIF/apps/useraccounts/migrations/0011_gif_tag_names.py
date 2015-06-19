# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('useraccounts', '0010_auto_20150619_1011'),
    ]

    operations = [
        migrations.AddField(
            model_name='gif',
            name='tag_names',
            field=models.CharField(default=b'', max_length=400, blank=True),
        ),
    ]
