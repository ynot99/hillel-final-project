# Generated by Django 3.2.9 on 2021-11-17 16:51

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0005_alter_userprofile_slug'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userfollowing',
            name='user_follower',
        ),
        migrations.AddField(
            model_name='userfollowing',
            name='user_following',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='following', to='blog.userprofile'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='userfollowing',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='follower', to='blog.userprofile'),
        ),
    ]