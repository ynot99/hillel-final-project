from django.urls import path

from .views import (
    CommentUserProfileView,
    PostAuthorizedView,
    PostCreateView,
    PostsByUserProfileView,
    UserFollowByFollowerView,
    UserFollowByUserView,
    UserProfileAuthenticatedView,
    BookmarkView,
    CommentView,
    PostView,
    PostsBookmarkAuthorizedView,
    PostsUserFollowView,
    PostsView,
    UserProfileView,
    PostsBookmarkView,
    UserFollowView,
)


app_name = "blog"

urlpatterns = [
    path("post/", PostsView.as_view(), name="posts"),
    path("post/<int:pk>", PostView.as_view(), name="post"),
    path(
        "post/create",
        PostCreateView.as_view(),
        name="post_authorized",
    ),
    path(
        "post/auth/<int:pk>",
        PostAuthorizedView.as_view(),
        name="post_authorized",
    ),
    path(
        "post/user_profile/<int:pk>/",
        PostsByUserProfileView.as_view(),
        name="posts_user_profile",
    ),
    path(
        "post/user_follow/",
        PostsUserFollowView.as_view(),
        name="posts_user_follow",
    ),
    path(
        "post/bookmark/<int:pk>/",
        PostsBookmarkView.as_view(),
        name="posts_bookmark",
    ),
    path(
        "post/bookmark/",
        PostsBookmarkAuthorizedView.as_view(),
        name="posts_bookmark_authorized",
    ),
    path(
        "bookmark/",
        BookmarkView.as_view(),
        name="bookmark",
    ),
    path(
        "comment/",
        CommentView.as_view(),
        name="comment",
    ),
    path(
        "user_profile/<slug:slug>",
        UserProfileView.as_view(),
        name="user_profile",
    ),
    path(
        "user_profile",
        UserProfileAuthenticatedView.as_view(),
        name="user_profile_authenticated",
    ),
    path(
        "user_follow/user/<int:pk>/",
        UserFollowByUserView.as_view(),
        name="user_follow_by_user",
    ),
    path(
        "user_follow/follower/<int:pk>/",
        UserFollowByFollowerView.as_view(),
        name="user_follow_by_follower",
    ),
    path(
        "user_follow/",
        UserFollowView.as_view(),
        name="user_follow",
    ),
    path(
        "comment/user/<int:pk>/",
        CommentUserProfileView.as_view(),
        name="comment_user_profile",
    ),
]
