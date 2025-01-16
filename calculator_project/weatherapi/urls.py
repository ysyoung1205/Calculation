from django.urls import path
from . import views

app_name = 'weather_api'

urlpatterns = [
    # path('fetch/', views.fetch_and_save_weather, name='fetch_weather'),
    path('weather1/', views.weather1, name='weather1'), # /weatherapi/weather1/ 경로로 접근
    # path('weatherApi/', views.weatherApi, name='weatherApi'), 
    # path("data_from_db/", views.get_weather_data_from_db, name="get_weather_from_db"),
    path("chart/", views.weather_chart_view, name="weather_chart"),
    path("weather2/", views.weather2, name="weather2"),
]