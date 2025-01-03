from django.shortcuts import render
from django.http import JsonResponse
# from sympy import sympify
from pymongo import MongoClient  # MongoDB 연결 라이브러리
from utils import evaluate_expression
from bson import ObjectId
from datetime import datetime
from pytz import timezone

# MongoDB 설정
client = MongoClient("mongodb://192.168.10.28:27017/")  # 기존 설정 그대로 사용
db = client["PythonTest"]  # 데이터베이스 이름
collection = db["test2"]  # 컬렉션 이름


# 메인 화면
def index(request):
    return render(request, 'calculator/index.html')  #계산기 화면 보여주기
#Programmer 계산기 화면
def programmers_calculator(request):
    return render(request, 'calculator/Programmers_Calculator.html')

# 계산 처리
def calculate(request):
    if request.method == 'POST':
        expression = request.POST.get('expression', '')  #입력된 수식
        print(f"Received expression: {expression}")  # 디버깅 출력
        try:
            result =  evaluate_expression(expression)
            result = float(result)  # 결과를 기본 타입으로 변환
            #result = eval(expression)  # 보안 문제 주의
            print(f"Calculated result: {result}")  # 계산된 결과 출력
            current_time = datetime.now()

# MongoDB에 데이터 저장
            inserted_id = collection.insert_one({
                "mode": "standard",
                "expression": expression,
                "result": str(result),
            }).inserted_id  # 저장된 문서의 _id 가져오기

            # MongoDB의 _id에서 시간 추출 (UTC 시간 기준)
            mongo_utc_time = ObjectId(inserted_id).generation_time

            # 로컬 시간 변환 (예: 한국 시간)
            local_tz = timezone('Asia/Seoul')
            mongo_local_time = mongo_utc_time.astimezone(local_tz)

            # MongoDB 문서 업데이트 (시간 필드 추가)
            collection.update_one(
                {"_id": inserted_id},
                {"$set": {
                    "start_time": mongo_utc_time,
                    "start_time_local": mongo_local_time,
                }}
            )

            # 결과 반환
            return JsonResponse({
                "expression": expression,
                "result": str(result),
                "start_time": mongo_utc_time.strftime('%Y-%m-%d %H:%M:%S'),
                "start_time_local": mongo_local_time.strftime('%Y-%m-%d %H:%M:%S %Z'),
            })
        except Exception:
            result = "Error"
        return JsonResponse({'expression': expression,'result': result})  
    return JsonResponse({'result': 'Invalid request'})

# 계산 처리
def Pcalculate(request):
    if request.method == 'POST':
        expression = request.POST.get('expression', '')  #입력된 수식
        try:
            result =  evaluate_expression(expression)
            # MongoDB에 저장
            collection.insert_one({
                "mode": "programmer",
                "expression": expression,
                "result": str(result)
            })

            return JsonResponse({'expression': expression, 'result': str(result)})  # JsonResponse로 결과 반환:
        except Exception:
            result = "Error"
        return JsonResponse({'expression': expression,'result': result})  
    return JsonResponse({'result': 'Invalid request'})





