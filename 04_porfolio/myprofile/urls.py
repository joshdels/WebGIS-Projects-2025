from django.urls import path

from . import views

urlpatterns = [
  path('', views.homepage, name="homepage"),  
  path('contact/', views.contact, name="contact"),
  path('about_me/', views.about_me, name="about_me"),
  path('project/', views.project, name="project")
]
