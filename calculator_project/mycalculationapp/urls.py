from django.urls import path
from mycalculationapp import views as calc_views  # mycalculationapp의 views를 불러옴

urlpatterns = [
    # mycalculationapp의 calculate 사용
    path("calculate/", calc_views.calculate, name="calculate"),
    path("get_results/", calc_views.get_results, name="get_results"),
    path("delete_result/", calc_views.delete_result, name="delete_result"),
    path("delete_all_results/", calc_views.delete_all_results, name="delete_all_results"),
    path('mongo-test/', calc_views.mongo_test, name='mongo_test'),
]