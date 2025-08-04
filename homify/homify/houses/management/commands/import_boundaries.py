from django.core.management.base import BaseCommand
from django.contrib.gis.utils import LayerMapping
from houses.models import Boundaries

class Command(BaseCommand):
  help = 'Import boundry data'
  
  def handle(self, *args, **kwargs):
    boundary_mapping = {
      'adm3_en': 'adm3_en',
      'adm2_en': 'adm2_en',
      'adm1_en': 'adm1_en',
      'shape_area': 'shape_area',
      'area_sqkm': 'area_sqkm',
      'geom': 'MULTIPOLYGON',
    }
    
    shp_path = r'D:\1. PROJECT\Webgis\homify\davao_del_norte.geojson'
    
    lm = LayerMapping(
      Boundaries,
      shp_path,
      boundary_mapping,
      transform=False,
      encoding='utf-8'
    )
    
    lm.save(strict=False, verbose=True)  # strict=False lets it skip missing fields
    self.stdout.write(self.style.SUCCESS("Boundaries imported successfully!"))