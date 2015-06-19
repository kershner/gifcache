# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('useraccounts', '0005_auto_20150617_1232'),
    ]

    operations = [
        migrations.AlterField(
            model_name='gif',
            name='notes',
            field=models.CharField(default=b'', max_length=400, blank=True),
        ),
    ]
