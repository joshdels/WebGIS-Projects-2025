from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.template import loader
from django.contrib.gis.geos import GEOSGeometry
from django.core.serializers import serialize
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Boundaries, Locations

# Create your views here.
def homepage(request):
  locations = Locations.objects.all()
  return render(request, './leaflet/index.html', {'locations':locations})

def location_data(request):
  location = Locations.objects.all()
  geojson = serialize('geojson', location)
  return HttpResponse(geojson, content_type='application/json')

def boundary_data(request):
  boundary = Boundaries.objects.all()
  geojson = serialize('geojson', boundary)
  return HttpResponse(geojson, content_type='application/json')

@csrf_exempt
def save_location(request):
  if request.method == 'POST':
    try:
      data = json.loads(request.body)
      geometry = data.get('geometry')
      
      geom = GEOSGeometry(json.dumps(geometry))
      location = Locations.objects.create(
        geom=geom
      )
      return JsonResponse({'status': 'success', 'id': location.id})
    
    except Exception as e:
      return JsonResponse({'status': 'error', 'message': str(e)})
    
  return JsonResponse({'status': 'error', 'message': 'POST request required'}, status=405)


def user_dashboard(request):
  locations = Locations.objects.all()
  return render(request, './user/dashboard.html', {'locations':locations})