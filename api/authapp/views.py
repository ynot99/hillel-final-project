from django.utils.text import slugify
from rest_framework.status import (
    HTTP_400_BAD_REQUEST,
)
from rest_framework.generics import (
    CreateAPIView,
)
from rest_framework.response import Response

from .models import User
from .serializers import UserRegisterSerializer


class RegisterView(CreateAPIView):
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
