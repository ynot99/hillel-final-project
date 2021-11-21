from django.contrib.auth.models import User
from rest_framework import exceptions, mixins
from rest_framework.serializers import Serializer
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response

from authapp.models import User
from .models import BookmarkPost, Comment, Post, UserFollow
from .serializers import (
    CommentForUserProfileSerializer,
    UserFollowByFollowerSerializer,
    UserFollowByUserSerializer,
    UserForUserFollowSerializer,
    BookmarkCreateSerializer,
    CommentCreateSerializer,
    CommentSerializer,
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
    queryset = Post.objects.all()

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


class PostView(generics.RetrieveAPIView):
    authentication_classes = [TokenAuthentication]
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        comment_serializer = CommentSerializer(
            Comment.objects.filter(post__pk=serializer.data["id"]), many=True
        )
        # TODO optimize comment count
        return Response(
            {"post": serializer.data, "comments": comment_serializer.data}
        )


class PostAuthorizedView(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = PostCreateSerializer

    def get_queryset(self):
        return Post.objects.filter(author__pk=self.request.user.id)


class BookmarkView(
    mixins.CreateModelMixin, mixins.DestroyModelMixin, generics.GenericAPIView
):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = BookmarkCreateSerializer

    def post(self, request):
        serializer: Serializer = self.get_serializer(
            data={"user": request.user.id, "post": request.data["post"]}
        )
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    def delete(self, request, *args, **kwargs):
        try:
            instance = BookmarkPost.objects.get(
                user=request.user.id, post__pk=request.data["post"]
            )
        except BookmarkPost.DoesNotExist:
            return Response(
                "Bookmark doesn't exist", status=status.HTTP_404_NOT_FOUND
            )
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


# TODO TOTALLY NOT OK!
class UserFollowView(
    mixins.CreateModelMixin, mixins.DestroyModelMixin, generics.GenericAPIView
):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = UserFollowSerializer

    def post(self, request, *args, **kwargs):
        # try:
        #     user = User.objects.get(user__pk=request.user.id)
        # except User.DoesNotExist:
        #     return Response("User doesn't exist", status=HTTP_400_BAD_REQUEST)
        request.data["user"] = request.user.id
        return super().create(request, *args, **kwargs)

    def get_object(self):
        # try:
        #     user = User.objects.get(user__pk=self.request.user.id)
        # except User.DoesNotExist:
        #     raise exceptions.bad_request(
        #         self.request, exception=exceptions.NotFound
        #     )
        #     # return Response("User doesn't exist", status=HTTP_400_BAD_REQUEST)
        try:
            instance = UserFollow.objects.get(
                user__pk=self.request.user.id,
                follower=self.request.data["follower"],
            )
        except UserFollow.DoesNotExist:
            raise exceptions.bad_request(
                self.request, exception=exceptions.NotFound
            )
            # return Response(
            #     "User is not following", status=HTTP_400_BAD_REQUEST
            # )

        return instance

    def delete(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

    # def delete(self, request, *args, **kwargs):
    #     try:
    #         user = UserProfile.objects.get(user__pk=request.user.id)
    #     except UserProfile.DoesNotExist:
    #         return Response("User doesn't exist", status=HTTP_400_BAD_REQUEST)
    #     try:
    #         instance = UserFollow.objects.get(
    #             user=user, follower=request.data["follower"]
    #         )
    #     except UserFollow.DoesNotExist:
    #         return Response(
    #             "User is not following", status=HTTP_400_BAD_REQUEST
    #         )

    #     self.perform_destroy(instance)
    #     return Response(status=HTTP_204_NO_CONTENT)


# TODO OK


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
        return User.objects.get(pk=self.request.user.id)


class CommentView(
    mixins.DestroyModelMixin, mixins.CreateModelMixin, generics.GenericAPIView
):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = CommentCreateSerializer

    def post(self, request, *args, **kwargs):
        request.data["user"] = request.user.id
        return super().create(request, *args, **kwargs)


class PostCreateView(generics.CreateAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = PostCreateSerializer

    def post(self, request, *args, **kwargs):
        request.data["author"] = request.user.id
        return super().post(request, *args, **kwargs)


class UserProfileView(generics.RetrieveAPIView):
    queryset = User.objects.all()
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
