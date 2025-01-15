from django.urls import path
from . import views

app_name = 'weatherapi'

urlpatterns = [
    # path('fetch/', views.fetch_and_save_weather, name='fetch_weather'),
    path('weather1/', views.weather1, name='weather1'), # /weatherapi/weather1/ 경로로 접근
    # path('weatherApi/', views.weatherApi, name='weatherApi'), 
]