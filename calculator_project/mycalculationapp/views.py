from django.http import JsonResponse
from pymongo import MongoClient
# from sympy import sympify  # 안전한 수식 계산을 위한 sympy 라이브러리
from utils import evaluate_expression


# MongoDB 설정
client = MongoClient("mongodb://192.168.10.28:27017/")  # 기존 설정 그대로 사용
db = client["PythonTest"]  # 데이터베이스 이름
collection = db["test2"]  # 컬렉션 이름

# 계산 및 결과 저장
def calculate(request):
    if request.method == 'POST':
        expression = request.POST.get('expression', '')  # 입력받은 수식
        try:
            # 수식 계산
            result =  evaluate_expression(expression)
            # 결과를 MongoDB에 저장
            collection.insert_one({
                "expression": expression,
                "result": str(result)
            })
            return JsonResponse({'expression': expression, 'result': str(result)})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'result': 'Invalid request'}, status=400)

# 저장된 결과 조회
def get_results(request):
    if request.method == "GET":
        results = list(collection.find({}, {"_id": 0}))  # 모든 결과 조회, _id 제외
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
        collection.delete_many({})  # 모든 결과 삭제
        return JsonResponse({"message": "All results deleted"})

# 테스트 함수 그대로 유지
def mongo_test(request):
    data = list(collection.find({}, {"_id": 0}))  # 모든 데이터 조회, _id는 제외
    return JsonResponse({"data": data})

# # MongoDB 연결 설정
# def mongo_connect():
#     client = MongoClient("mongodb://localhost:27017/")  # MongoDB 연결 문자열
#     db = client['mydatabase']  # 사용할 데이터베이스
#     collection = db['mycollection']  # 사용할 컬렉션
#     return collection

# 예제: MongoDB 데이터 삽입 및 조회
# def mongo_test(request):
#     client = MongoClient("mongodb://192.168.10.28:27017/")
#     db = client['PythonTest']  # 데이터베이스 이름
#     collection = db['test1']  # 컬렉션 이름

#     #collection = mongo_connect()
#     # 예제 데이터 삽입
#     collection.insert_one({"name": "John Doe", "age": 30})
#     # 데이터 삽입
#     # collection.insert_one({"name": "John Doe", "age": 30})

#     # 데이터 조회
#     data = list(collection.find({}, {"_id": 0}))  # `_id` 필드는 제외

#     return JsonResponse({"data": data})