# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('useraccounts', '0002_auto_20150617_0956'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('username', models.CharField(max_length=100)),
                ('password', models.CharField(max_length=50)),
                ('email', models.CharField(max_length=100)),
                ('firstname', models.CharField(max_length=50)),
            ],
        ),
        migrations.AlterField(
            model_name='gif',
            name='owner',
            field=models.ForeignKey(to='useraccounts.User'),
        ),
        migrations.DeleteModel(
            name='Profile',
        ),
    ]
