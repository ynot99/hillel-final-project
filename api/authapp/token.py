from rest_framework.status import (
    HTTP_400_BAD_REQUEST,
)
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response

from .models import User


class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        token, _ = Token.objects.get_or_create(user=user)
        try:
            avatar_url = user.avatar.url
        except:
            avatar_url = None
        return Response(
            {
                "id": user.id,
                "slug": user.slug,
                "token": token.key,
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "avatar": avatar_url,
            }
        )
