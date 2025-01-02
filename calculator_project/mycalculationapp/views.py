from django.http import JsonResponse
from pymongo import MongoClient
# from sympy import sympify  # 안전한 수식 계산을 위한 sympy 라이브러리
from utils import evaluate_expression
import csv  # ★ 추가
from django.http import HttpResponse  # 추가


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
        results = list(collection.find({"mode": "programmer"},  {"_id": 0}))  # 모든 결과 조회, _id 제외
        return JsonResponse({"results": results})

# P특정 결과 삭제
def delete_presult(request):
    if request.method == "POST":
        try:
            expression = request.POST.get("expression")  # 삭제할 수식
            collection.delete_one({"expression": expression})
            return JsonResponse({"message": "Result deleted"})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

# P모든 결과 삭제
def delete_all_presults(request):
    if request.method == "POST":
        collection.delete_many({"mode": "programmer"})  # 모든 결과 삭제
        return JsonResponse({"message": "All results deleted"})

def export_to_csv(request):
    """
    DB에 저장된 계산 결과를 CSV 파일로 내려주는 뷰
    """
    # 1) DB에서 결과 가져오기
    results = list(collection.find({"mode": "programmer"}, {"_id": 0}))  
    # [{ "mode": "standard", "expression": "3+3", "result": "6" }, ...]

    # 2) HttpResponse 생성 (Content-Type= 'text/csv')
    response = HttpResponse(content_type='text/csv')
    # 다운로드 파일 이름 지정
    response['Content-Disposition'] = 'attachment; filename="calculation.csv"'

    # 3) csv.writer로 작성
    writer = csv.writer(response)
    
    # 헤더 작성 (필요에 따라 조정)
    writer.writerow(['mode', 'expression', 'result'])

    # DB 결과를 CSV 행으로
    for item in results:
        mode_val = item.get("mode", "")
        expression_val = item.get("expression", "")
        result_val = item.get("result", "")
        writer.writerow([mode_val, expression_val, result_val])

    # 4) response 반환 -> 브라우저 다운로드
    return response
