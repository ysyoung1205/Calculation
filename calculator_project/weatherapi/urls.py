from django.urls import path
from . import views

urlpatterns = [
    path('fetch/', views.fetch_and_save_weather, name='fetch_weather'),
]