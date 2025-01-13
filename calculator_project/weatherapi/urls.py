from django.urls import path
from . import views

app_name = 'weatherapi'

urlpatterns = [
    # path('fetch/', views.fetch_and_save_weather, name='fetch_weather'),
    path('chart/', views.chart_view, name='chart'), # chart/로 접근 시 실행
]