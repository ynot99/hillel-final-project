from django.urls import path

from .views import RegisterView, UserUpdateView


app_name = "authapp"

urlpatterns = [
    path("register", RegisterView.as_view(), name="register"),
    path("user/update", UserUpdateView.as_view(), name="user_update"),
]
