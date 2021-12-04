from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework.request import Request

from .models import (
    Post,
    RatingPost,
    RatingComment,
    UserFollow,
    BookmarkPost,
    Comment,
)


class RatingPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = RatingPost
        fields = ["is_upvote", "user", "post"]


class RatingCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = RatingComment
        fields = ["is_upvote", "user", "comment"]


class BookmarkCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookmarkPost
        fields = [
            "user",
            "post",
        ]


# TODO remove when figure out how to load images from dockerized django with nginx
class TMPUserImageFieldSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField("get_avatar")

    def get_avatar(self, profile):
        return "/api/media/" + profile.avatar.name

    class Meta:
        model = get_user_model()
        fields = ["avatar"]


class UserSerializer(TMPUserImageFieldSerializer):
    class Meta(TMPUserImageFieldSerializer.Meta):
        # model = get_user_model()
        fields = TMPUserImageFieldSerializer.Meta.fields + [
            "id",
            "username",
            "first_name",
            "last_name",
            # "avatar",
        ]


class UserForPostSerializer(TMPUserImageFieldSerializer):
    class Meta(TMPUserImageFieldSerializer.Meta):
        # model = get_user_model()
        fields = TMPUserImageFieldSerializer.Meta.fields + [
            "id",
            "username",
            # "avatar",
            "slug",
        ]


class UserForUserFollowSerializer(TMPUserImageFieldSerializer):
    class Meta(TMPUserImageFieldSerializer.Meta):
        # model = get_user_model()
        fields = TMPUserImageFieldSerializer.Meta.fields + [
            "id",
            "slug",
            "username",
            "first_name",
            "last_name",
            # "avatar",
        ]


class UserForProfileSerializer(TMPUserImageFieldSerializer):
    post_count = serializers.SerializerMethodField("get_post_count")
    comment_count = serializers.SerializerMethodField("get_comment_count")
    bookmark_count = serializers.SerializerMethodField("get_bookmark_count")
    like_count = serializers.SerializerMethodField("get_like_count")
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

    def get_like_count(self, profile):
        return RatingPost.objects.filter(user=profile, is_upvote=True).count()

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

    class Meta(TMPUserImageFieldSerializer.Meta):
        # model = get_user_model()
        fields = TMPUserImageFieldSerializer.Meta.fields + [
            "id",
            "first_name",
            "last_name",
            "username",
            # "avatar",
            "post_count",
            "comment_count",
            "bookmark_count",
            "like_count",
            "followers_count",
            "follow_count",
            "is_followed_by_authorized_user",
        ]


class CommentSerializer(serializers.ModelSerializer):
    user = UserForPostSerializer()
    rating = serializers.SerializerMethodField("get_rating")
    is_upvote = serializers.SerializerMethodField("get_is_upvote")

    def get_rating(self, comment):
        rating_comments = RatingComment.objects.filter(comment=comment)
        if not len(rating_comments):
            return 0

        rating = 0
        for rating_comment in rating_comments:
            rating += 1 if rating_comment.is_upvote else -1

        return rating

    def get_is_upvote(self, comment):
        request: Request = self.context.get("request", None)
        if request.user.is_anonymous:
            return None

        try:
            rating_comment = RatingComment.objects.get(
                user__pk=request.user.id, comment=comment
            )
        except RatingComment.DoesNotExist:
            return None

        return rating_comment.is_upvote

    class Meta:
        model = Comment
        fields = [
            "id",
            "user",
            "content",
            "reply_to",
            "created_at",
            "rating",
            "is_upvote",
        ]


class CommentWithReplyCountSerializer(CommentSerializer):
    reply_count = serializers.SerializerMethodField("get_reply_count")

    def get_reply_count(self, comment):
        return Comment.objects.filter(reply_to=comment).count()

    class Meta(CommentSerializer.Meta):
        fields = CommentSerializer.Meta.fields + [
            "reply_count",
        ]


class PostSerializer(serializers.ModelSerializer):
    author = UserForPostSerializer()
    bookmark_count = serializers.SerializerMethodField("get_bookmark_count")
    comment_count = serializers.SerializerMethodField("get_comment_count")
    rating = serializers.SerializerMethodField("get_rating")
    is_upvote = serializers.SerializerMethodField("get_is_upvote")
    is_bookmarked = serializers.SerializerMethodField("get_is_bookmarked")

    def get_bookmark_count(self, post):
        return BookmarkPost.objects.filter(post=post).count()

    def get_comment_count(self, post):
        return Comment.objects.filter(post=post).count()

    def get_rating(self, post):
        rating_posts = RatingPost.objects.filter(post=post)
        if not len(rating_posts):
            return 0

        rating = 0
        for rating_post in rating_posts:
            rating += 1 if rating_post.is_upvote else -1

        return rating

    def get_is_upvote(self, post):
        request: Request = self.context.get("request", None)
        if request.user.is_anonymous:
            return None

        try:
            rating_post = RatingPost.objects.get(
                user__pk=request.user.id, post=post
            )
        except RatingPost.DoesNotExist:
            return None

        return rating_post.is_upvote

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
            "created_at",
            "rating",
            "is_upvote",
            "is_bookmarked",
            "bookmark_count",
            "comment_count",
        ]


class PostWithCommentsSerializer(PostSerializer):
    comments = serializers.SerializerMethodField("get_comments")

    def get_comments(self, post):
        return CommentWithReplyCountSerializer(
            Comment.objects.filter(post__pk=post.id, reply_to=None),
            many=True,
            context={"request": self.context.get("request", None)},
        ).data

    class Meta(PostSerializer.Meta):
        fields = PostSerializer.Meta.fields + ["comments"]


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


class CommentForUserProfileSerializer(serializers.ModelSerializer):
    user = UserForPostSerializer()
    post = PostHeaderSerializer()
    rating = serializers.SerializerMethodField("get_rating")
    is_upvote = serializers.SerializerMethodField("get_is_upvote")

    def get_rating(self, comment):
        rating_comments = RatingComment.objects.filter(comment=comment)
        if not len(rating_comments):
            return 0

        rating = 0
        for rating_comment in rating_comments:
            rating += 1 if rating_comment.is_upvote else -1

        return rating

    def get_is_upvote(self, comment):
        request: Request = self.context.get("request", None)
        if request.user.is_anonymous:
            return None

        try:
            rating_comment = RatingComment.objects.get(
                user__pk=request.user.id, comment=comment
            )
        except RatingComment.DoesNotExist:
            return None

        return rating_comment.is_upvote

    class Meta:
        model = Comment
        fields = [
            "id",
            "user",
            "content",
            "post",
            "rating",
            "is_upvote",
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
