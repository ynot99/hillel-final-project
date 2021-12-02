from django.db import models

from api.settings import AUTH_USER_MODEL


class UserFollow(models.Model):
    user = models.ForeignKey(
        AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="follow_user"
    )
    follower = models.ForeignKey(
        AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="follower"
    )

    class Meta:
        unique_together = ["user", "follower"]


class Post(models.Model):
    header = models.CharField(max_length=255)
    author = models.ForeignKey(
        to=AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL
    )
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]


class Comment(models.Model):
    post = models.ForeignKey(to=Post, on_delete=models.CASCADE)
    user = models.ForeignKey(
        to=AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL
    )
    content = models.TextField()
    reply_to = models.ForeignKey(
        to="self", null=True, blank=True, on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["created_at"]


class RatingBase(models.Model):
    is_upvote = models.BooleanField()
    user = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.CASCADE)

    class Meta:
        abstract = True


class RatingPost(RatingBase):
    post = models.ForeignKey(to=Post, on_delete=models.CASCADE)

    class Meta:
        unique_together = ["user", "post"]


class RatingComment(RatingBase):
    comment = models.ForeignKey(to=Comment, on_delete=models.CASCADE)

    class Meta:
        unique_together = ["user", "comment"]


class BookmarkBase(models.Model):
    user = models.ForeignKey(to=AUTH_USER_MODEL, on_delete=models.CASCADE)

    class Meta:
        abstract = True


class BookmarkPost(BookmarkBase):
    post = models.ForeignKey(to=Post, on_delete=models.CASCADE)

    class Meta:
        unique_together = ["user", "post"]
