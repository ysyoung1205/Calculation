from django.urls import path
from MDBconnect import views as calc_views  # mycalculationapp의 views를 불러옴

urlpatterns = [
    #standard
    path("get_results/", calc_views.get_results, name="get_results"),
    path("delete_result/", calc_views.delete_result, name="delete_result"),
    path("delete_all_results/", calc_views.delete_all_results, name="delete_all_results"),
    #programmer
    path("get_presults/", calc_views.get_presults, name="get_presults"),
    path("delete_presult/", calc_views.delete_presult, name="delete_presult"),
    path("delete_all_presultsByDate/", calc_views.delete_all_presultsByDate, name="delete_all_presultsByDate"),
    path("delete_all_presults/", calc_views.delete_all_presults, name="delete_all_presults"),
    
    path("export_to_csv/", calc_views.export_to_csv, name="export_to_csv"), #내보내기
    path('get_presults_by_date_post', calc_views.get_presults_by_date_post, name='get_presults_by_date_post'),
    # path("upload_csv/", calc_views.upload_csv, name="upload_csv"), #내보내기
]