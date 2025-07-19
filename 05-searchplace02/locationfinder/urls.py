from django.urls import path

from . import views

urlpatterns = [
  path("", views.index, name="index"),
  path("process/", views.process_data, name="geojson_data"),
  path("mydata/", views.serve_geojson, name='serve_geojson')
]