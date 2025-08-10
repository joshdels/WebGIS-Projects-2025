from django import forms
from .models import Location, LocationImages
from django.forms import modelformset_factory

class LocationForm(forms.ModelForm):
  class Meta:
    model = Location
    fields = ['available', "status", "rent_per_month", "type", "no_units", "area_sqm", "address", "phone", "email"]
    
class LocationImageForm(forms.ModelForm):
  class Meta:
    model = LocationImages
    fields = ['image']
    
# Create a formset (for handling multiple images)
LocationImageFormSet = modelformset_factory(
    LocationImages,
    form=LocationImageForm,
    extra=1,  # number of empty image forms to display
    max_num=10
)