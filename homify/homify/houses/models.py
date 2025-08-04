from django.contrib.gis.db import models

# Create your models here.
class Boundaries(models.Model):
   adm3_en = models.CharField(max_length=255, null=True, blank=True)
   adm2_en = models.CharField(max_length=255, null=True, blank=True)
   adm1_en = models.CharField(max_length=255, null=True, blank=True)
  
   shape_area = models.FloatField(null=True, blank=True)
   area_sqkm = models.FloatField(null=True, blank=True)
   
   geom = models.MultiPolygonField(srid=4326)
   
class Locations(models.Model):
   status = models.CharField(max_length=255, null=True, blank=True) 
   type = models.CharField(max_length=255, null=True, blank=True)
   no_rooms = models.IntegerField(null=True, blank=True)
   available = models.CharField(max_length=255, null=True, blank=True)
   contact = models.CharField(max_length=255, null=True, blank=True)
   
   geom = models.PointField(srid=4326)
   #test