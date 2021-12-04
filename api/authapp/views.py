from django.utils.text import slugify
from rest_framework import generics, exceptions
from rest_framework.status import (
    HTTP_400_BAD_REQUEST,
)
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication

from .models import User
from .serializers import UserRegisterSerializer, UserUpdateSerializer


class RegisterView(generics.CreateAPIView):
    serializer_class = UserRegisterSerializer

    def create(self, request):
        print(request.data)
        try:
            User.objects.create_user(
                username=request.data["username"],
                email=request.data["email"],
                password=request.data["password"],
                first_name=request.data["first_name"],
                last_name=request.data["last_name"],
                slug=slugify(request.data["username"]),
            )
        except:
            return Response(data={}, status=HTTP_400_BAD_REQUEST)

        return Response(data={})


class UserUpdateView(generics.UpdateAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = UserUpdateSerializer

    def get_object(self):
        try:
            user_obj = User.objects.get(pk=self.request.user.id)
        except User.DoesNotExist:
            raise exceptions.NotFound
        return user_obj
