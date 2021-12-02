# Generated by Django 3.2.9 on 2021-12-02 14:26

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('blog', '0002_auto_20211202_1406'),
    ]

    operations = [
        migrations.CreateModel(
            name='RatingComment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_upvote', models.BooleanField()),
            ],
        ),
        migrations.CreateModel(
            name='RatingPost',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_upvote', models.BooleanField()),
            ],
        ),
        migrations.RemoveField(
            model_name='comment',
            name='rating_story',
        ),
        migrations.RemoveField(
            model_name='post',
            name='rating_story',
        ),
        migrations.DeleteModel(
            name='Rating',
        ),
        migrations.AddField(
            model_name='ratingpost',
            name='post',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='blog.post'),
        ),
        migrations.AddField(
            model_name='ratingpost',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='ratingcomment',
            name='comment',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='blog.comment'),
        ),
        migrations.AddField(
            model_name='ratingcomment',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterUniqueTogether(
            name='ratingpost',
            unique_together={('user', 'post')},
        ),
        migrations.AlterUniqueTogether(
            name='ratingcomment',
            unique_together={('user', 'comment')},
        ),
    ]
