# from django.urls import path
from django.urls import path, include
from . import views
# from django.contrib import admin

urlpatterns = [
    path('', views.index, name='index'),          # 기본 페이지
    path('programmers_calculator/', views.programmers_calculator, name='programmers_calculator'),  # Programmers Calculator 페이지
    path('calculate/', views.calculate, name='calculate'),  # 계산 처리
    path('Pcalculate/', views.Pcalculate, name='Pcalculate'),  # 계산 처리
    # path('admin/', admin.site.urls),
    path('', include('mycalculationapp.urls')),
    # path('get_results/', views.get_results, name='get_results'),  #result불러오기    



]
