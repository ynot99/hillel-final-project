from django.contrib.auth.models import User
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
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response

from .models import BookmarkPost, Post, UserProfile
from .serializers import (
    BookmarkCreateSerializer,
    PostSerializer,
    UserProfileRegisterSerializer,
)


class PostsView(ListAPIView):
    authentication_classes = [TokenAuthentication]
    queryset = Post.objects.all()
    serializer_class = PostSerializer


class PostView(RetrieveAPIView):
    authentication_classes = [TokenAuthentication]
    queryset = Post.objects.all()
    serializer_class = PostSerializer


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

    def destroy(self, request, *args, **kwargs):
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


class RegisterView(CreateAPIView):
    serializer_class = UserProfileRegisterSerializer

    def create(self, request):
        try:
            user = User.objects.create_user(
                request.data["username"],
                request.data["email"],
                request.data["password"],
            )
            UserProfile.objects.create(user=user)
        except:
            return Response(data={}, status=HTTP_400_BAD_REQUEST)

        return Response(data={})
