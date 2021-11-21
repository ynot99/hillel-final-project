from django.contrib.auth.models import User
from django.utils.text import slugify
from rest_framework.serializers import Serializer
from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_204_NO_CONTENT,
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
)
from rest_framework.generics import (
    CreateAPIView,
    DestroyAPIView,
    ListAPIView,
    RetrieveAPIView,
    RetrieveUpdateAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response

from .models import BookmarkPost, Comment, Post, UserFollow, UserProfile
from .serializers import (
    CommentForUserProfileSerializer,
    UserFollowingByFollowerSerializer,
    UserFollowingByUserSerializer,
    UserProfileAuthSerializer,
    BookmarkCreateSerializer,
    CommentCreateSerializer,
    CommentSerializer,
    PostCreateSerializer,
    PostSerializer,
    UserFollowingSerializer,
    UserProfileForProfileSerializer,
    UserProfileRegisterSerializer,
)


class PostsView(ListAPIView):
    authentication_classes = [TokenAuthentication]
    queryset = Post.objects.all()
    serializer_class = PostSerializer


class PostsByUserProfileView(ListAPIView):
    authentication_classes = [TokenAuthentication]
    serializer_class = PostSerializer

    def get_queryset(self):
        return Post.objects.filter(author=self.kwargs["pk"])


class PostsUserFollowingView(ListAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = PostSerializer

    def get_queryset(self):
        try:
            user = UserProfile.objects.get(user__pk=self.request.user.id)
        except UserProfile.DoesNotExist:
            return Response("User doesn't exist", status=HTTP_400_BAD_REQUEST)
        return Post.objects.filter(
            author__pk__in=UserFollow.objects.filter(
                user__pk=user.id
            ).values_list("follower")
        )


class PostsBookmarkedView(ListAPIView):
    authentication_classes = [TokenAuthentication]
    serializer_class = PostSerializer
    queryset = Post.objects.all()

    def get_queryset(self):
        return Post.objects.filter(
            pk__in=BookmarkPost.objects.filter(
                user__pk=self.kwargs["pk"]
            ).values_list("post")
        )


class PostsBookmarkedAuthorizedView(ListAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = PostSerializer

    def get_queryset(self):
        try:
            user = UserProfile.objects.get(user__pk=self.request.user.id)
        except UserProfile.DoesNotExist:
            return Response("User doesn't exist", status=HTTP_400_BAD_REQUEST)
        return Post.objects.filter(
            pk__in=BookmarkPost.objects.filter(user__pk=user.id).values_list(
                "post"
            )
        )


class PostView(RetrieveAPIView):
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


class PostAuthorizedView(RetrieveUpdateDestroyAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = PostCreateSerializer

    def get_queryset(self):
        try:
            user = UserProfile.objects.get(user__pk=self.request.user.id)
        except UserProfile.DoesNotExist:
            return Response("User doesn't exist", status=HTTP_400_BAD_REQUEST)

        return Post.objects.filter(author__pk=user.id)


class PostCreateView(CreateAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = PostCreateSerializer

    def post(self, request):
        try:
            user = UserProfile.objects.get(user__pk=request.user.id)
        except UserProfile.DoesNotExist:
            return Response("User doesn't exist", status=HTTP_400_BAD_REQUEST)
        request.data["author"] = user.id
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=HTTP_201_CREATED, headers=headers
        )


class BookmarkAddView(CreateAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = BookmarkCreateSerializer

    def create(self, request):
        try:
            user = UserProfile.objects.get(user__pk=request.user.id)
        except UserProfile.DoesNotExist:
            return Response("User doesn't exist", status=HTTP_400_BAD_REQUEST)
        serializer: Serializer = self.get_serializer(
            data={"user": user.id, "post": request.data["post"]}
        )
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=HTTP_201_CREATED, headers=headers
        )


class BookmarkRemoveView(DestroyAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        try:
            user = UserProfile.objects.get(user=request.user.id)
        except UserProfile.DoesNotExist:
            return Response("User doesn't exist", status=HTTP_400_BAD_REQUEST)
        try:
            instance = BookmarkPost.objects.get(
                user=user, post__pk=request.data["post"]
            )
        except BookmarkPost.DoesNotExist:
            return Response("Bookmark doesn't exist", status=HTTP_404_NOT_FOUND)
        self.perform_destroy(instance)
        return Response(status=HTTP_204_NO_CONTENT)


class UserProfileAuthView(RetrieveAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileAuthSerializer

    def get(self, request, *args, **kwargs):
        try:
            instance = UserProfile.objects.get(user__pk=request.user.pk)
        except UserProfile.DoesNotExist:
            return Response("User doesn't exist", status=HTTP_400_BAD_REQUEST)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class UserProfileView(RetrieveAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileForProfileSerializer
    lookup_field = "slug"


class UserFollowingByUserView(ListAPIView):
    serializer_class = UserFollowingByUserSerializer

    def get_queryset(self):
        return UserFollow.objects.filter(user__pk=self.kwargs["pk"])


class UserFollowingByFollowerView(ListAPIView):
    serializer_class = UserFollowingByFollowerSerializer

    def get_queryset(self):
        return UserFollow.objects.filter(follower__pk=self.kwargs["pk"])


class UserFollowingCreateView(CreateAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = UserFollowingSerializer

    def create(self, request, *args, **kwargs):
        try:
            user = UserProfile.objects.get(user__pk=request.user.id)
        except UserProfile.DoesNotExist:
            return Response("User doesn't exist", status=HTTP_400_BAD_REQUEST)
        request.data["user"] = user.id
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=HTTP_201_CREATED, headers=headers
        )


class UserFollowingDeleteView(DestroyAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = UserFollowingSerializer

    def delete(self, request, *args, **kwargs):
        try:
            user = UserProfile.objects.get(user__pk=request.user.id)
        except UserProfile.DoesNotExist:
            return Response("User doesn't exist", status=HTTP_400_BAD_REQUEST)
        try:
            instance = UserFollow.objects.get(
                user=user, follower=request.data["follower"]
            )
        except UserFollow.DoesNotExist:
            return Response(
                "User is not following", status=HTTP_400_BAD_REQUEST
            )

        self.perform_destroy(instance)
        return Response(status=HTTP_204_NO_CONTENT)


class CommentByUserProfileView(ListAPIView):
    serializer_class = CommentForUserProfileSerializer

    def get_queryset(self):
        return Comment.objects.filter(user__pk=self.kwargs["pk"])


class CommentCreateView(CreateAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = CommentCreateSerializer

    def create(self, request, *args, **kwargs):
        try:
            user = UserProfile.objects.get(user__pk=request.user.id)
        except UserProfile.DoesNotExist:
            return Response("User doesn't exist", status=HTTP_400_BAD_REQUEST)
        request.data["user"] = user.id
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=HTTP_201_CREATED, headers=headers
        )


class RegisterView(CreateAPIView):
    serializer_class = UserProfileRegisterSerializer

    def create(self, request):
        try:
            user = User.objects.create_user(
                username=request.data["username"],
                email=request.data["email"],
                password=request.data["password"],
                first_name=request.data["first_name"],
                last_name=request.data["last_name"],
            )

            UserProfile.objects.create(user=user, slug=slugify(user.username))
        except:
            return Response(data={}, status=HTTP_400_BAD_REQUEST)

        return Response(data={})
