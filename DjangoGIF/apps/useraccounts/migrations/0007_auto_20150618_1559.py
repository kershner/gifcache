# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('useraccounts', '0006_auto_20150617_1436'),
    ]

    operations = [
        migrations.RenameField(
            model_name='gif',
            old_name='notes',
            new_name='label',
        ),
    ]
