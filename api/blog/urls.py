from django.urls import path

from .views import (
    BookmarkAddView,
    BookmarkRemoveView,
    PostView,
    PostsView,
    RegisterView,
)


app_name = "blog"

urlpatterns = [
    path("post/", PostsView.as_view(), name="posts"),
    path("post/<int:pk>", PostView.as_view(), name="post"),
    path(
        "post/bookmark/create",
        BookmarkAddView.as_view(),
        name="bookmark_add",
    ),
    path(
        "post/bookmark/delete",
        BookmarkRemoveView.as_view(),
        name="bookmark_remove",
    ),
    path("register", RegisterView.as_view(), name="register"),
]
