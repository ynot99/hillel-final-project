from rest_framework.status import (
    HTTP_400_BAD_REQUEST,
)
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response

from .models import UserProfile


class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        try:
            userProfile = UserProfile.objects.get(user__pk=user.pk)
        except UserProfile.DoesNotExist:
            return Response("User doesn't exist", status=HTTP_400_BAD_REQUEST)
        token, created = Token.objects.get_or_create(user=user)
        try:
            avatar_url = userProfile.avatar.url
        except:
            avatar_url = None
        return Response(
            {
                "id": userProfile.id,
                "slug": userProfile.slug,
                "token": token.key,
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "avatar": avatar_url,
            }
        )
