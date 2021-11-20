from django.contrib import admin

from .models import BookmarkPost, UserProfile, Comment, Post, UserFollow


class UserProfileAdmin(admin.ModelAdmin):
    readonly_fields = ["slug"]


admin.site.register(BookmarkPost)
admin.site.register(UserProfile, UserProfileAdmin)
admin.site.register(UserFollow)
admin.site.register(Comment)
admin.site.register(Post)
