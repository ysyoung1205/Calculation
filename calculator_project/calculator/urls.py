# from django.urls import path
from django.urls import path, include
from . import views
# from django.contrib import admin

urlpatterns = [
    path('', views.index, name='index'),          # 기본 페이지
    path('calculate/', views.calculate, name='calculate'),  # 계산 처리
    path('programmers_calculator/', views.programmers_calculator, name='programmers_calculator'),  # Programmers Calculator 페이지
    path('Pcalculate/', views.Pcalculate, name='Pcalculate'),  # Pcalculate 추가
    # path('admin/', admin.site.urls),
    path('', include('mycalculationapp.urls')),
    
]
