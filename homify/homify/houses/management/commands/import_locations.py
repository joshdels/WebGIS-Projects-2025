from django.core.management.base import BaseCommand
from django.contrib.gis.utils import LayerMapping
from houses.models import Locations

class Command(BaseCommand):
  help = 'Import location data'
  
  def handle(self, *args, **kwargs):
    location_mapping = {
      'status': 'status',
      'geom': 'POINT',
    }
    # change this if shp/geojson is changed
    shp_path = r'D:\1. PROJECT\Webgis\homify\point.geojson'
    
    lm = LayerMapping(
      Locations,
      shp_path,
      location_mapping,
      transform=False,
      encoding='utf-8'
    )
    
    lm.save(strict=False, verbose=True)
    self.stdout.write(self.style.SUCCESS("Locations imported Succesfully"))