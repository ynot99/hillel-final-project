from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator


class UserProfile(models.Model):
    user = models.OneToOneField(to=User, on_delete=models.CASCADE)
    avatar = models.ImageField(null=True, blank=True)
    slug = models.SlugField(unique=True)

    def __str__(self) -> str:
        return self.user.username


class UserFollow(models.Model):
    user = models.ForeignKey(
        UserProfile, on_delete=models.CASCADE, related_name="follow_user"
    )
    follower = models.ForeignKey(
        UserProfile, on_delete=models.CASCADE, related_name="follower"
    )

    class Meta:
        unique_together = ["user", "follower"]


class Post(models.Model):
    header = models.CharField(max_length=255)
    author = models.ForeignKey(
        to=UserProfile, null=True, blank=True, on_delete=models.SET_NULL
    )
    content = models.TextField()
    upvotes = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    downvotes = models.IntegerField(
        default=0, validators=[MinValueValidator(0)]
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]


class Comment(models.Model):
    post = models.ForeignKey(to=Post, on_delete=models.CASCADE)
    user = models.ForeignKey(
        to=UserProfile, null=True, blank=True, on_delete=models.SET_NULL
    )
    content = models.TextField()
    reply_to = models.ForeignKey(
        to="self", null=True, blank=True, on_delete=models.CASCADE
    )
    upvotes = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    downvotes = models.IntegerField(
        default=0, validators=[MinValueValidator(0)]
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]


class BookmarkBase(models.Model):
    user = models.ForeignKey(to=UserProfile, on_delete=models.CASCADE)

    class Meta:
        abstract = True


class BookmarkPost(BookmarkBase):
    post = models.ForeignKey(to=Post, on_delete=models.CASCADE)

    class Meta:
        unique_together = ["user", "post"]
