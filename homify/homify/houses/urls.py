from django.urls import path
from . import views

urlpatterns = [
  path('', views.homepage, name='homepage'),
  path('homepage/ ', views.homepage, name='homepage'),
  path('location-data/', views.location_data, name='location'),
  path('boundary-data/', views.boundary_data, name='boundary'),
  path('save-location/', views.save_location, name='save-location'),
  # for users
  path('user-dashboard/', views.user_dashboard, name='user_dashboard'),
  path('add_location/', views.add_location, name='add_location'),
]