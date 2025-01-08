from django.urls import path, include
from . import views


urlpatterns = [
    path('', views.index, name='index'),          # 기본 페이지
    path('standard/', views.standard, name='standard'),  # standard Calculator 페이지
    path('programmer/', views.programmer, name='programmer'),  # Programmers Calculator 페이지
    path('calculate/', views.calculate, name='calculate'),  # 계산 처리
    path('Pcalculate/', views.Pcalculate, name='Pcalculate'),  # 계산 처리
    path('', include('MDBconnect.urls')),
]
