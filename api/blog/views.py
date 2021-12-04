from django.contrib.auth import get_user_model
from rest_framework import exceptions, mixins
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response

from .models import (
    BookmarkPost,
    Comment,
    Post,
    RatingComment,
    RatingPost,
    UserFollow,
)
from .serializers import (
    CommentForUserProfileSerializer,
    CommentSerializer,
    PostWithCommentsSerializer,
    RatingCommentSerializer,
    RatingPostSerializer,
    UserFollowByFollowerSerializer,
    UserFollowByUserSerializer,
    UserForUserFollowSerializer,
    BookmarkCreateSerializer,
    CommentCreateSerializer,
    PostCreateSerializer,
    PostSerializer,
    UserFollowSerializer,
    UserForProfileSerializer,
)


class PostsUserFollowView(generics.ListAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = PostSerializer

    def get_queryset(self):
        return Post.objects.filter(
            author__pk__in=UserFollow.objects.filter(
                user__pk=self.request.user.id
            ).values_list("follower")
        )


class PostsBookmarkView(generics.ListAPIView):
    authentication_classes = [TokenAuthentication]
    serializer_class = PostSerializer

    def get_queryset(self):
        return Post.objects.filter(
            pk__in=BookmarkPost.objects.filter(
                user__pk=self.kwargs["pk"]
            ).values_list("post")
        )


class PostsBookmarkAuthorizedView(generics.ListAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = PostSerializer

    def get_queryset(self):
        return Post.objects.filter(
            pk__in=BookmarkPost.objects.filter(
                user__pk=self.request.user.id
            ).values_list("post")
        )


class PostsLikedView(generics.ListAPIView):
    authentication_classes = [TokenAuthentication]
    serializer_class = PostSerializer

    def get_queryset(self):
        return Post.objects.filter(
            pk__in=RatingPost.objects.filter(
                user__pk=self.kwargs["pk"], is_upvote=True
            ).values_list("post")
        )


class PostsLikedAuthorizedView(generics.ListAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = PostSerializer

    def get_queryset(self):
        return Post.objects.filter(
            pk__in=RatingPost.objects.filter(
                user__pk=self.request.user.id, is_upvote=True
            ).values_list("post")
        )


class PostView(generics.RetrieveAPIView):
    authentication_classes = [TokenAuthentication]
    queryset = Post.objects.all()
    serializer_class = PostWithCommentsSerializer


class PostAuthorizedView(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = PostCreateSerializer

    def get_queryset(self):
        return Post.objects.filter(author__pk=self.request.user.id)


class RatingPostView(
    mixins.CreateModelMixin,
    generics.RetrieveUpdateDestroyAPIView,
):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = RatingPostSerializer

    def post(self, request, *args, **kwargs):
        request.data["user"] = request.user.id
        return self.create(request, *args, **kwargs)

    def get_object(self):
        try:
            instance = RatingPost.objects.get(
                user=self.request.user.id, post__pk=self.request.data["post"]
            )
        except RatingPost.DoesNotExist:
            raise exceptions.NotFound
        return instance

    def update(self, request, *args, **kwargs):
        request.data["user"] = request.user.id
        return super().update(request, *args, **kwargs)


class RatingCommentView(
    mixins.CreateModelMixin,
    generics.RetrieveUpdateDestroyAPIView,
):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = RatingCommentSerializer

    def post(self, request, *args, **kwargs):
        request.data["user"] = request.user.id
        return self.create(request, *args, **kwargs)

    def get_object(self):
        try:
            instance = RatingComment.objects.get(
                user=self.request.user.id,
                comment__pk=self.request.data["comment"],
            )
        except RatingComment.DoesNotExist:
            raise exceptions.NotFound
        return instance

    def update(self, request, *args, **kwargs):
        request.data["user"] = request.user.id
        return super().update(request, *args, **kwargs)


class BookmarkView(mixins.CreateModelMixin, generics.DestroyAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = BookmarkCreateSerializer

    def post(self, request, *args, **kwargs):
        request.data["user"] = request.user.id
        return self.create(request, *args, **kwargs)

    def get_object(self):
        try:
            instance = BookmarkPost.objects.get(
                user=self.request.user.id, post__pk=self.request.data["post"]
            )
        except BookmarkPost.DoesNotExist:
            raise exceptions.NotFound
        return instance


class UserFollowView(mixins.CreateModelMixin, generics.DestroyAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = UserFollowSerializer

    def post(self, request, *args, **kwargs):
        request.data["user"] = request.user.id
        return super().create(request, *args, **kwargs)

    def get_object(self):
        try:
            instance = UserFollow.objects.get(
                user__pk=self.request.user.id,
                follower=self.request.data["follower"],
            )
        except UserFollow.DoesNotExist:
            # TODO I think it must be a bad request exception
            raise exceptions.NotFound

        return instance


class PostsView(generics.ListAPIView):
    authentication_classes = [TokenAuthentication]
    queryset = Post.objects.all()
    serializer_class = PostSerializer


class PostsByUserProfileView(generics.ListAPIView):
    authentication_classes = [TokenAuthentication]
    serializer_class = PostSerializer

    def get_queryset(self):
        return Post.objects.filter(author=self.kwargs["pk"])


class UserProfileAuthenticatedView(generics.RetrieveAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = UserForUserFollowSerializer

    def get_object(self):
        return get_user_model().objects.get(pk=self.request.user.id)


class CommentView(
    mixins.CreateModelMixin, generics.RetrieveUpdateDestroyAPIView
):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = CommentCreateSerializer

    def post(self, request, *args, **kwargs):
        request.data["user"] = request.user.id
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        request.data["user"] = request.user.id
        request.data["post"] = instance.post.id
        serializer = self.get_serializer(
            instance, data=request.data, partial=partial
        )
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, "_prefetched_objects_cache", None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

    def get_object(self):
        try:
            instance = Comment.objects.get(
                pk=self.request.data["id"],
                user__pk=self.request.user.id,
            )
        except Comment.DoesNotExist:
            raise exceptions.NotFound

        return instance


class CommentByReplyToView(generics.ListAPIView):
    serializer_class = CommentSerializer

    def get_queryset(self):
        return Comment.objects.filter(reply_to=self.kwargs["pk"])


class PostCreateView(generics.CreateAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = PostCreateSerializer

    def post(self, request, *args, **kwargs):
        request.data["author"] = request.user.id
        return super().post(request, *args, **kwargs)


class UserProfileView(generics.RetrieveAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = UserForProfileSerializer
    lookup_field = "slug"


class UserFollowByUserView(generics.ListAPIView):
    serializer_class = UserFollowByUserSerializer

    def get_queryset(self):
        return UserFollow.objects.filter(user__pk=self.kwargs["pk"])


class UserFollowByFollowerView(generics.ListAPIView):
    serializer_class = UserFollowByFollowerSerializer

    def get_queryset(self):
        return UserFollow.objects.filter(follower__pk=self.kwargs["pk"])


class CommentUserProfileView(generics.ListAPIView):
    serializer_class = CommentForUserProfileSerializer

    def get_queryset(self):
        return Comment.objects.filter(user__pk=self.kwargs["pk"])
