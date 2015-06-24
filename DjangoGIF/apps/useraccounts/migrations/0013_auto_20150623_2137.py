# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('useraccounts', '0012_auto_20150623_1429'),
    ]

    operations = [
        migrations.AlterField(
            model_name='gif',
            name='thumbnail',
            field=models.ImageField(default=b'', upload_to=b'thumbs'),
        ),
    ]
