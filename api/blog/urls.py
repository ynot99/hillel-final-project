from django.urls import path

from .views import (
    CommentByUserProfileView,
    PostAuthorizedView,
    PostsByUserProfileView,
    UserFollowingByFollowerView,
    UserFollowingByUserView,
    UserFollowingDeleteView,
    UserProfileAuthView,
    BookmarkAddView,
    BookmarkRemoveView,
    CommentCreateView,
    PostCreateView,
    PostView,
    PostsBookmarkedAuthorizedView,
    PostsUserFollowingView,
    PostsView,
    RegisterView,
    UserProfileView,
    PostsBookmarkedView,
    UserFollowingCreateView,
)


app_name = "blog"

urlpatterns = [
    path("post/", PostsView.as_view(), name="posts"),
    path("post/<int:pk>", PostView.as_view(), name="post"),
    path(
        "post/<int:pk>/edit",
        PostAuthorizedView.as_view(),
        name="post_authorized",
    ),
    path("post/create", PostCreateView.as_view(), name="post_create"),
    path(
        "post/user_profile/<int:pk>/",
        PostsByUserProfileView.as_view(),
        name="posts_user_profile",
    ),
    path(
        "post/user_follow/",
        PostsUserFollowingView.as_view(),
        name="posts_user_follow",
    ),
    path(
        "post/bookmark/",
        PostsBookmarkedAuthorizedView.as_view(),
        name="posts_bookmark_authorized",
    ),
    path(
        "post/bookmark/<int:pk>/",
        PostsBookmarkedView.as_view(),
        name="posts_bookmark",
    ),
    path(
        "post/bookmark/create",
        BookmarkAddView.as_view(),
        name="bookmark_create",
    ),
    path(
        "post/bookmark/delete",
        BookmarkRemoveView.as_view(),
        name="bookmark_remove",
    ),
    path(
        "post/comment/create",
        CommentCreateView.as_view(),
        name="comment_create",
    ),
    path(
        "user_profile",
        UserProfileAuthView.as_view(),
        name="user_profile_auth",
    ),
    path(
        "user_profile/<slug:slug>",
        UserProfileView.as_view(),
        name="user_profile",
    ),
    path(
        "user_follow/user/<int:pk>/",
        UserFollowingByUserView.as_view(),
        name="user_follow_by_user",
    ),
    path(
        "user_follow/follower/<int:pk>/",
        UserFollowingByFollowerView.as_view(),
        name="user_follow_by_follower",
    ),
    path(
        "user_follow/create",
        UserFollowingCreateView.as_view(),
        name="user_follow_create",
    ),
    path(
        "user_follow/delete",
        UserFollowingDeleteView.as_view(),
        name="user_follow_delete",
    ),
    path(
        "comment/user/<int:pk>",
        CommentByUserProfileView.as_view(),
        name="comment_by_user_profile",
    ),
    path("register", RegisterView.as_view(), name="register"),
]
