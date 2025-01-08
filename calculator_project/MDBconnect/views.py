from django.http import JsonResponse
from pymongo import MongoClient
from utils import evaluate_expression
import csv  
from django.http import HttpResponse 
# from datetime import datetime
# from bson.objectid import ObjectId  # ObjectId를 사용해야 _id로 작업 가능
from bson import ObjectId  # MongoDB ObjectId를 처리하기 위해 필요




# MongoDB 설정
client = MongoClient("mongodb://192.168.10.28:27017/")  # 기존 설정 그대로 사용
db = client["PythonTest"]  # 데이터베이스 이름
collection = db["test2"]  # 컬렉션 이름

# 저장된 결과 조회
def get_results(request):
    if request.method == "GET":
        results = list(collection.find({"mode": "standard"},  {"_id": 0}))  # 모든 결과 조회, _id 제외
        return JsonResponse({"results": results})

# 특정 결과 삭제
def delete_result(request):
    if request.method == "POST":
        try:
            expression = request.POST.get("expression")  # 삭제할 수식
            collection.delete_one({"expression": expression})
            return JsonResponse({"message": "Result deleted"})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

# 모든 결과 삭제
def delete_all_results(request):
    if request.method == "POST":
        collection.delete_many({"mode": "standard"})  # 모든 결과 삭제
        return JsonResponse({"message": "All results deleted"})

# P저장된 결과 조회
def get_presults(request):
    if request.method == "GET":
        results = list(collection.find({"mode": "programmer"}, {"_id":1, "expression": 1, "result": 1, "type": 1}))

        # _id를 문자열로 변환
        for result in results:
            result["_id"] = str(result["_id"])
        return JsonResponse({"results": results})

# P특정 결과 삭제
def delete_presult(request):
    if request.method == "POST":
        try:
            # 요청에서 expression과 id를 가져오기
            expression = request.POST.get("expression")
            doc_id = request.POST.get("id")

            if not doc_id:
                return JsonResponse({'error': 'ID가 제공되지 않았습니다.'}, status=400)

            # _id를 ObjectId로 변환
            object_id = ObjectId(doc_id)

            # MongoDB에서 _id와 expression을 함께 사용해 문서 삭제
            result = collection.delete_one({"_id": object_id, "expression": expression})

            if result.deleted_count > 0:
                return JsonResponse({"message": "Result deleted"})
            else:
                return JsonResponse({'error': '삭제할 문서를 찾을 수 없습니다.'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

# P날짜별 결과 삭제
def delete_all_presultsByDate(request):
    if request.method == "POST":
        selected_date = request.POST.get("date", "")
        if not selected_date:
            return JsonResponse({'error': "No 'date' provided."}, status=400)
        
        try:
            # 날짜 범위 생성
            start_of_day = f"{selected_date} 00:00:00.000"
            end_of_day = f"{selected_date} 23:59:59.999"
            print("selected_date",selected_date)
        except ValueError:
            return JsonResponse({'error': "Invalid 'date' format."}, status=400)

        try:
            # MongoDB에서 해당 날짜 범위에 해당하는 문서 삭제
            result = collection.delete_many({
                "mode": "programmer",
                "date": {"$gte": start_of_day, "$lte": end_of_day}
            })
            return JsonResponse({
                "message": f"Results deleted for the date {selected_date}",
                "deleted_count": result.deleted_count
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)

# P모든 결과 삭제
def delete_all_presults(request):
    if request.method == "POST":
        collection.delete_many({"mode": "programmer"})  # 모든 결과 삭제
        return JsonResponse({"message": "All results deleted"})

#날짜별 데이터 조회
def get_presults_by_date_post(request):
    if request.method == 'POST':
        selected_date = request.POST.get('date', '')

        if not selected_date:
            return JsonResponse({'error': "No 'date' provided."}, status=400)
        try:
            start_of_day = f"{selected_date} 00:00:00.000"
            end_of_day = f"{selected_date} 23:59:59.999"

        except ValueError:
            return JsonResponse({'error': "Invalid 'date' format."}, status=400)
        
        results = list(collection.find({
            "mode": "programmer",
            "date": {"$gte": start_of_day, "$lte": end_of_day}  # 날짜 범위로 필터링
        }, {"_id":1, "expression": 1, "result": 1, "type": 1}))

        # _id를 문자열로 변환
        for result in results:
            result["_id"] = str(result["_id"])
        return JsonResponse({"results": results}, safe=False)

    
    return JsonResponse({'error': 'Invalid request method'}, status=405)


#CSV 파일 저장
def export_to_csv(request):
    # 1) 날짜 조건 가져오기
    selected_date = request.GET.get('date')  # 요청에서 날짜 가져오기 (예: ?date=2025-01-01)
    print(selected_date)
    # 2) MongoDB 쿼리 생성
    query = {}
    if selected_date:
        try:
            # 선택된 날짜의 시작과 끝 범위 설정
            start_of_day =  f"{selected_date} 00:00:00.000"
            end_of_day = f"{selected_date} 23:59:59.999"
            query = {"date": {"$gte": start_of_day, "$lte": end_of_day}}
        except ValueError:
            return HttpResponse("날짜 형식이 잘못되었습니다. (예: YYYY-MM-DD)", status=400)

    # 3) DB에서 결과 가져오기
    results = list(collection.find(query, {"_id": 1, "mode": 1, "expression": 1, "result": 1, "date_utc": 1, "date": 1, "type": 1}))

    # 2) HttpResponse 생성 (Content-Type= 'text/csv')
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] =(
    f'attachment; filename="calculations_{selected_date}.csv"'
    if selected_date else 'attachment; filename="calculations.csv"'
)  # 다운로드 파일명 설정

    # 3) CSV 작성기 생성
    writer = csv.writer(response)

    # 4) 헤더 작성
    writer.writerow(['ID', 'MODE', 'EXPRESSION', 'RESULT', 'UTC', 'KST', 'TYPE'])  # 캡처된 헤더

    # 5) 데이터 작성
    for item in results:
        _id_val = str(item.get("_id", ""))
        mode_val = item.get("mode", "")
        expression_val = item.get("expression", "")
        result_val = item.get("result", "")
        date_utc_val = item.get("date_utc", "")
        date_val = item.get("date", "")
        type_val = item.get("type", "")

        # 행 데이터 추가
        writer.writerow([_id_val, mode_val, expression_val, result_val, date_utc_val, date_val, type_val])

    # 6) response 반환 -> 브라우저 다운로드
    return response


# def upload_csv(request):
#     if request.method == "POST":
#         csv_file = request.FILES.get("csv-file")
#         if not csv_file:
#             return JsonResponse({"error": "No file provided"}, status=400)

#         try:
#             decoded_file = csv_file.read().decode("utf-8").splitlines()
#             reader = csv.DictReader(decoded_file)  # CSV 헤더를 기준으로 읽기

#             # 3) DB에 데이터 저장
#             for row in reader:
#                 # "mode", "expression", "result" 필드가 CSV에 포함되어 있어야 함
#                 collection.insert_one({
#                     "mode": row.get("mode", ""),
#                     "expression": row.get("expression", ""),
#                     "result": row.get("result", "")
#                 })

#             return JsonResponse({"message": "CSV 파일 업로드 및 데이터 저장 성공!"})
#         except Exception as e:
#             return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)

#     return JsonResponse({"error": "Invalid request method"}, status=405)
