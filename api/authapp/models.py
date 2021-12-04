from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    avatar = models.ImageField(
        upload_to="avatars", default=None, null=True, blank=True
    )
    slug = models.SlugField(unique=True)
