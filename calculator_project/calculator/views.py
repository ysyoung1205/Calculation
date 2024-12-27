from django.shortcuts import render
from django.http import JsonResponse
# from sympy import sympify
from pymongo import MongoClient  # MongoDB 연결 라이브러리
from utils import evaluate_expression

# MongoDB 설정
client = MongoClient("mongodb://192.168.10.28:27017/")  # 기존 설정 그대로 사용
db = client["PythonTest"]  # 데이터베이스 이름
collection = db["test2"]  # 컬렉션 이름

try:
    collection.insert_one({"test": "connection"})
    print("Data inserted successfully")
except Exception as e:
    print(f"Error inserting data: {e}")


# 메인 화면
def index(request):
    return render(request, 'calculator/index.html')  #계산기 화면 보여주기

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

            # MongoDB에 저장
            collection.insert_one({
                "expression": expression,
                "result": str(result)
            })

            # 결과 반환
            return JsonResponse({
                "expression": expression,
                "result": str(result)
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
            return JsonResponse({'expression': expression, 'result': str(result)})  # JsonResponse로 결과 반환:
        except Exception:
            result = "Error"
        return JsonResponse({'expression': expression,'result': result})  
    return JsonResponse({'result': 'Invalid request'})

def programmers_calculator(request):
    return render(request, 'calculator/Programmers_Calculator.html')

