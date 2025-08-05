from django.contrib.gis.db import models
from django.contrib.postgres.indexes import GistIndex 

# Create your models here.
class Boundaries(models.Model):
   adm3_en = models.CharField(max_length=255, null=True, blank=True)
   adm2_en = models.CharField(max_length=255, null=True, blank=True)
   adm1_en = models.CharField(max_length=255, null=True, blank=True)
  
   shape_area = models.FloatField(null=True, blank=True)
   area_sqkm = models.FloatField(null=True, blank=True)
   
   geom = models.MultiPolygonField(srid=4326)
   
class Locations(models.Model):
   address = models.CharField(max_length=300, null=True, blank=True)
   no_units = models.IntegerField(null=True, blank=True)
   status = models.CharField(max_length=255, null=True, blank=True) 
   type = models.CharField(max_length=255, null=True, blank=True)
   area_sqm = models.IntegerField(null=True, blank=True)
   no_rooms = models.IntegerField(null=True, blank=True)
   available = models.CharField(max_length=255, null=True, blank=True)
   phone = models.CharField(max_length=255, null=True, blank=True)
   email = models.EmailField(null=True, blank=True)
   website = models.URLField(null=True, blank=True)
   rent_per_month = models.IntegerField(null=True, blank=True)
   
   geom = models.PointField(srid=4326)
   
   class Meta:
      indexes = [
         models.Index(fields=["geom"]),
         GistIndex(fields=["geom"]),
      ]

class LocationsImages(models.Model):
   location = models.ForeignKey(Locations, on_delete=models.CASCADE, related_name='images')
   image = models.ImageField(upload_to='location_images/')