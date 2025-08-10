from django.urls import path
from . import views

urlpatterns = [
  path('', views.homepage, name='homepage'),
  path('homepage/', views.homepage, name='homepage'),
  path('location-data/', views.location_data, name='location'),
  path('boundary-data/', views.boundary_data, name='boundary'),
  # for users
  path('user-dashboard/', views.user_dashboard, name='user-dashboard'),
  path('modal-form/', views.get_modalform, name='modal-form'),
  path('add-location/', views.add_location, name='add-location'),
]