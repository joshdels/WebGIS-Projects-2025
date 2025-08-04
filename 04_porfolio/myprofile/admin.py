from django.contrib import admin
from .models import Project, Experience, Client

# Register your models here.
admin.site.register([Project, Experience, Client])
