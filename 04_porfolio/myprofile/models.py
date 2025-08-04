from django.db import models

# Create your models here.
class Project(models.Model):
  name = models.CharField(max_length=100, blank=True, null=True)
  image = models.ImageField(upload_to='project_image/', blank=True, null=True) 
  content = models.CharField(max_length=1000)
  tags = models.CharField(max_length=100)
  pub_date = models.DateTimeField("Date Published")
  def __str__(self):
    return f"{self.name} on {self.pub_date.strftime('%Y-%m-%d')}"
  
class Experience(models.Model):
  company = models.CharField(max_length=100, blank=True, null=True)
  location = models.CharField(max_length=100, blank=True, null=True)
  logo = models.ImageField(upload_to='experience_logos/', blank=True, null=True)
  position = models.CharField(max_length=200, blank=True, null=True)
  roles = models.CharField(max_length=1000, blank=True, null=True)
  date_joined = models.DateTimeField("Date", blank=True, null=True)
  date_ended = models.DateTimeField("Date", blank=True, null=True)
  
  def __str__(self):
    return f"{self.company} as {self.position}"
  
class Client(models.Model):
  first_name = models.CharField(max_length=200)
  last_name = models.CharField(max_length=200)
  email = models.EmailField(max_length=200, blank=True, null=True)
  position = models.CharField(max_length=200, blank=True, null=True)
  msg_time = models.DateTimeField("Date", auto_now_add=True)
  comment = models.TextField(blank=True, null=True)
  
  def __str__(self):
    return f"{self.first_name} {self.last_name}"