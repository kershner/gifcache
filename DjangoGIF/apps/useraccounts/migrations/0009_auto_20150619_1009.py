# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('useraccounts', '0008_gif_tags'),
    ]

    operations = [
        migrations.AlterField(
            model_name='gif',
            name='owner',
            field=models.ForeignKey(to='useraccounts.Profile'),
        ),
    ]
