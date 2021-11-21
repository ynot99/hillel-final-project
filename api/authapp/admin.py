from django.contrib.admin import ModelAdmin, site

from .models import User


site.register(User)
