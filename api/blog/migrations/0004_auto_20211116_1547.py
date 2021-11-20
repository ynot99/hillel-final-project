# Generated by Django 3.2.9 on 2021-11-16 15:47

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0003_auto_20211112_0859'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='comment',
            options={'ordering': ['-created_at']},
        ),
        migrations.AlterModelOptions(
            name='post',
            options={'ordering': ['-created_at']},
        ),
        migrations.AddField(
            model_name='userprofile',
            name='slug',
            field=models.SlugField(default='woah'),
            preserve_default=False,
        ),
        migrations.CreateModel(
            name='UserFollowing',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='following', to='blog.userprofile')),
                ('user_follower', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='follower', to='blog.userprofile')),
            ],
        ),
    ]
