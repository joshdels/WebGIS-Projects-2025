from django.shortcuts import render, HttpResponse, redirect
from django.http import JsonResponse
import time

import osmnx as ox
import geopandas as gpd
import pandas as pd

# Create your views here.
def index(request):
    #the problem is only here :D
    place = request.GET.get('place')
    if place and place != request.session.get('location'):
        request.session['location'] = place
        return process_data(request)
    
    content = {
        'place': place
    }
    return render(request, 'leaflet1.html', content)

def process_data(request):
    if request.method == 'GET':
        location =  request.GET.get('place')
        print(f'Location received: {location}')
        
        if not location:
            return HttpResponse("No location provided", status=400)
        
        tags = {
            'amenity': ['cafe']
        }

        try:
            time.sleep(2)
            query_data = ox.features_from_place(location, tags)
            
        except Exception as e:
            print("Exception:", e)
            return redirect(f'/?error=location_not_found')

        else:
            print("Successfully retrieved!")
            print(f"Original data count: {len(query_data)}")

            query_data = query_data.dropna(subset=['name'])
            print(f"Remaining count after filtering: {len(query_data)}")

            polygon = query_data[query_data.geom_type == 'Polygon']
            points = query_data[query_data.geom_type == 'Point']
            polygon["geometry"] = polygon["geometry"].centroid

            gdf_merged = gpd.GeoDataFrame(pd.concat([polygon, points], ignore_index=True))
            gdf_merged = gdf_merged[['name', 'amenity', 'geometry']]

            geojson_data = gdf_merged.to_json()
            request.session['geojson'] = geojson_data
            request.session['location'] = location
            
            return redirect(f"/?place={location}")
    
    return HttpResponse("Only POST method is allowed", status=405)
  
def serve_geojson(request):
    geojson_data = request.session.get('geojson')
    if geojson_data:
        return HttpResponse(geojson_data, content_type='application/json')
    return JsonResponse({'error': 'No data available'}, status=404)
  

    
