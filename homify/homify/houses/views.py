from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.template import loader
from .models import Boundaries, Locations
from django.core.serializers import serialize
import geopandas as gpd

# Create your views here.
def homepage(request):
  location = Locations.objects.all()
  return render(request, './leaflet/index.html', {'locations':location})

def location_data(request):
  location = Locations.objects.all()
  geojson = serialize('geojson', location)
  return HttpResponse(geojson, content_type='application/json')

def boundary_data(request):
  boundary = Boundaries.objects.all()
  geojson = serialize('geojson', boundary)
  return HttpResponse(geojson, content_type='applocation/json')

  