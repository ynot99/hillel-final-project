from django.contrib import admin

from .models import BookmarkPost, Comment, Post, UserFollow


admin.site.register(BookmarkPost)
admin.site.register(UserFollow)
admin.site.register(Comment)
admin.site.register(Post)
