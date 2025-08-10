from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.template import loader
from django.contrib.gis.geos import GEOSGeometry
from django.core.serializers import serialize
from django.views.decorators.csrf import csrf_exempt
from django.template.loader import render_to_string
import json
from .models import Boundary, Location, LocationImages
from .forms import LocationForm, LocationImageFormSet

# Create your views here.
def homepage(request):
  locations = Location.objects.all()
  return render(request, 'leaflet/index.html', {'locations':locations})

def location_data(request):
  location = Location.objects.all()
  geojson = serialize('geojson', location)
  return HttpResponse(geojson, content_type='application/json')

def boundary_data(request):
  boundary = Boundary.objects.all()
  geojson = serialize('geojson', boundary)
  return HttpResponse(geojson, content_type='application/json')

def user_dashboard(request):
  locations = Location.objects.all()
  return render(request, 'user/dashboard.html', {'locations':locations})

# im so baddd na kuha naman to gahapon karon error napod
def get_modalform(request):
    if request.method == 'POST':
      form = LocationForm(request.POST)
      
      if form.is_valid():
        location = form.save()
        
        # ajax
        if request.headers.get('x-requested-with') == "XMLHttpRequest":
            return JsonResponse({'success': True})
        else:
          return redirect('location_list')
    
      else:
        if request.headers.get('x-requested-with') == "XMLHttpRequest":
          html = render_to_string('user/modalform.html', {
            'form': form,
          }, request=request)
          return JsonResponse({'success': False, 'html': html})

    else:
      form = LocationForm()
      
      if request.headers.get('x-requested-with') == "XMLHttpRequest":
        html = render_to_string('user/modalform.html', {
          'form': form,
        }, request=request)
        return JsonResponse({'success': False, 'html': html})
      
    return render(request, 'user/modalform.html', {
      'form': form,
    })
    
#maya na to 
def edit_location(request):
  # add pa ang urls 
    if request.method == 'POST':
      form = LocationForm(request.POST)
      
      if form.is_valid():
        location = form.save()
        
        # ajax
        if request.headers.get('x-requested-with') == "XMLHttpRequest":
            return JsonResponse({'success': True})
        else:
          return redirect('location_list')
    
      else:
        if request.headers.get('x-requested-with') == "XMLHttpRequest":
          html = render_to_string('user/add_location_form.html', {
            'form': form,
          }, request=request)
          return JsonResponse({'success': False, 'html': html})

    else:
      form = LocationForm()
      
      if request.headers.get('x-requested-with') == "XMLHttpRequest":
        html = render_to_string('user/add_location_form.html', {
          'form': form,
        }, request=request)
        return JsonResponse({'success': False, 'html': html})
      
    return render(request, 'user/add_location_form.html', {
      'form': form,
    })

def add_location(request):
  if request.method == 'POST':
    form = LocationForm(request.POST)
    if form.is_valid():
      location = form.save()
      imageset = LocationImages(request.POST, request.FILES, instance=location)
      if imageset.is_valid():
        imageset.save()
        return redirect("user_dashboard")
    else:
      form = LocationForm()
      imageset = LocationImages()
  else:
    form = LocationForm()
    imageset = LocationImages()
  return render(request, 'dashboard.html', {'form': form, 'imageset': imageset})