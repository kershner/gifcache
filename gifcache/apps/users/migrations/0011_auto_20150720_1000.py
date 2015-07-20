# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0010_gif_formatted_url'),
    ]

    operations = [
        migrations.RenameField(
            model_name='gif',
            old_name='formatted_url',
            new_name='display_url',
        ),
    ]
