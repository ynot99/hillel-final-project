from django.contrib import admin

from .models import (
    BookmarkPost,
    Comment,
    Post,
    UserFollow,
    RatingComment,
    RatingPost,
)


admin.site.register(BookmarkPost)
admin.site.register(UserFollow)
admin.site.register(Comment)
admin.site.register(Post)
admin.site.register(RatingPost)
admin.site.register(RatingComment)
