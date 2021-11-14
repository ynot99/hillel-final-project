from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.request import Request

from .models import Post, UserProfile, BookmarkPost, Comment


class BookmarkCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookmarkPost
        fields = [
            "user",
            "post",
        ]


class UserForPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "username",
        ]


class UserProfileSerializer(serializers.ModelSerializer):
    user = UserForPostSerializer()

    class Meta:
        model = UserProfile
        fields = [
            "id",
            "user",
            "avatar",
        ]


class PostSerializer(serializers.ModelSerializer):
    author = UserProfileSerializer()
    bookmark_count = serializers.SerializerMethodField("get_bookmark_count")
    comment_count = serializers.SerializerMethodField("get_comment_count")
    is_bookmarked = serializers.SerializerMethodField("get_is_bookmarked")

    def get_bookmark_count(self, post):
        return BookmarkPost.objects.filter(post=post).count()

    def get_comment_count(self, post):
        return Comment.objects.filter(post=post).count()

    def get_is_bookmarked(self, post):
        request: Request = self.context.get("request", None)
        if request.user.is_anonymous:
            return False

        try:
            BookmarkPost.objects.get(
                user=UserProfile.objects.get(user=request.user), post=post
            )
        except BookmarkPost.DoesNotExist:
            return False

        return True

    class Meta:
        model = Post
        fields = [
            "id",
            "header",
            "author",
            "content",
            "upvotes",
            "downvotes",
            "created_at",
            "is_bookmarked",
            "bookmark_count",
            "comment_count",
        ]


class UserProfileRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            "user",
        ]
