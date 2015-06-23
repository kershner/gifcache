# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('useraccounts', '0011_gif_tag_names'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='gif',
            name='tag_names',
        ),
        migrations.AddField(
            model_name='gif',
            name='thumbnail',
            field=models.ImageField(default=b'', upload_to=b'gifs'),
        ),
    ]
