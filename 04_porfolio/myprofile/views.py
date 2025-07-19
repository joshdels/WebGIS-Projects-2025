from django.shortcuts import render
from django.template import loader
from django.http import HttpResponse
from .models import Client, Experience, Project

# Create your views here.
def homepage(request):
  template = loader.get_template('index.html')
  content = {}
  return HttpResponse(template.render(content, request))

def project(request):
  project = Project.objects.all().order_by("-pub_date")
  template = loader.get_template('project.html')
  content = {'projects': project}
  return HttpResponse(template.render(content, request))

def about_me(request):
  experience = Experience.objects.all().order_by("-date_joined")
  template = loader.get_template('about_me.html')
  content = {'experiences': experience}
  return HttpResponse(template.render(content, request))

def contact(request):
  if request.method == "POST":
    first_name = request.POST.get('first_name')
    last_name = request.POST.get('last_name')
    email = request.POST.get('email')
    role = request.POST.get('role')
    comment = request.POST.get('comment')
    
    if Client.objects.filter(email=email).exists():
        return render(request, 'contact.html', {
            'error': 'Email has already been taken.',
            'success': False, 
        })
    
    Client.objects.create(
      first_name=first_name,
      last_name=last_name,
      email=email,
      position=role,
      comment=comment
    )
    
    return render(request, 'contact.html', {'success': True})

  return render(request, 'contact.html')

