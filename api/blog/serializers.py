from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.request import Request

from authapp.models import User
from .models import Post, UserFollow, BookmarkPost, Comment


# region Bookmark
class BookmarkCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookmarkPost
        fields = [
            "user",
            "post",
        ]


# endregion Bookmark


# region User
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "avatar",
        ]


class UserForPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "avatar",
            "slug",
        ]


class UserForUserFollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "slug",
            "username",
            "first_name",
            "last_name",
            "avatar",
        ]


class UserForProfileSerializer(serializers.ModelSerializer):
    post_count = serializers.SerializerMethodField("get_post_count")
    comment_count = serializers.SerializerMethodField("get_comment_count")
    bookmark_count = serializers.SerializerMethodField("get_bookmark_count")
    followers_count = serializers.SerializerMethodField("get_followers_count")
    follow_count = serializers.SerializerMethodField("get_follow_count")
    is_followed_by_authorized_user = serializers.SerializerMethodField(
        "get_is_followed"
    )

    def get_post_count(self, profile):
        return Post.objects.filter(author=profile).count()

    def get_comment_count(self, profile):
        return Comment.objects.filter(user=profile).count()

    def get_bookmark_count(self, profile):
        return BookmarkPost.objects.filter(user=profile).count()

    def get_followers_count(self, profile):
        return UserFollow.objects.filter(user=profile).count()

    def get_follow_count(self, profile):
        return UserFollow.objects.filter(follower=profile).count()

    def get_is_followed(self, profile):
        request: Request = self.context.get("request", None)
        if request.user.is_anonymous:
            return False

        try:
            UserFollow.objects.get(
                user=request.user,
                follower=profile,
            )
        except UserFollow.DoesNotExist:
            return False

        return True

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "avatar",
            "post_count",
            "comment_count",
            "bookmark_count",
            "followers_count",
            "follow_count",
            "is_followed_by_authorized_user",
        ]


# endregion User

# region Post
class PostSerializer(serializers.ModelSerializer):
    author = UserForPostSerializer()
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
            BookmarkPost.objects.get(user__pk=request.user.id, post=post)
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


class PostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = [
            "header",
            "author",
            "content",
        ]


class PostHeaderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = [
            "id",
            "header",
        ]


# endregion Post

# region Comment
class CommentSerializer(serializers.ModelSerializer):
    user = UserForPostSerializer()

    class Meta:
        model = Comment
        fields = [
            "id",
            "user",
            "content",
            "reply_to",
            "upvotes",
            "downvotes",
            "created_at",
        ]


class CommentForUserProfileSerializer(serializers.ModelSerializer):
    user = UserForPostSerializer()
    post = PostHeaderSerializer()

    class Meta:
        model = Comment
        fields = [
            "id",
            "user",
            "content",
            "post",
            "upvotes",
            "downvotes",
            "created_at",
        ]


class CommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = [
            "post",
            "user",
            "content",
            "reply_to",
        ]


# endregion Comment

# region UserFollow
class UserFollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFollow
        fields = ["user", "follower"]


class UserFollowByUserSerializer(serializers.ModelSerializer):
    user = UserForUserFollowSerializer(source="follower")

    class Meta:
        model = UserFollow
        fields = ["user"]


class UserFollowByFollowerSerializer(serializers.ModelSerializer):
    user = UserForUserFollowSerializer()

    class Meta:
        model = UserFollow
        fields = ["user"]


# endregion UserFollow
