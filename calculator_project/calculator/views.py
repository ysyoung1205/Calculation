from django.shortcuts import render
from django.http import JsonResponse
from pymongo import MongoClient  # MongoDB 연결 라이브러리
from utils import evaluate_expression
from datetime import datetime, timezone, timedelta

# MongoDB 설정
client = MongoClient("mongodb://192.168.10.28:27017/")  
db = client["PythonTest"]  # 데이터베이스 이름
collection = db["test2"]  # 컬렉션 이름

def index(request):
    return render(request, 'index.html', {'header_title': 'Main'})

def standard(request):
    return render(request, 'calculator/standard.html', {'header_title': 'Calculator - standard'})

def programmer(request):
    return render(request, 'calculator/programmer.html', {'header_title': 'Calculator - programmer '})

# 계산 처리
def calculate(request):
    if request.method == 'POST':
        expression = request.POST.get('expression', '') 
        try:
            result =  evaluate_expression(expression)
            date_str = request.POST.get("date", "")
            if not date_str:
                date_str = datetime.now().strftime("%Y-%m-%d")
            
            # MongoDB에 저장
            collection.insert_one({
                "mode": "standard",
                "expression": expression,
                "result": str(result),
                "date": date_str
            })

            # 결과 반환
            return JsonResponse({
                "expression": expression,
                "result": str(result),
            })
        except Exception:
            result = "Error"
        return JsonResponse({'expression': expression,'result': result})  
    return JsonResponse({'result': 'Invalid request'})




# 계산 처리
def Pcalculate(request):
    if request.method == 'POST':
        expression = request.POST.get('expression', '')  #입력된 수식
        bit_size = int(request.POST.get('bit_size', 16))  # 비트 크기 (기본값: 16) 
        if bit_size == 16:
            type = "WORD"
        elif bit_size == 32:
            type = "DWORD"
        elif bit_size == 64:
            type = "QWORD"
        else:
            type = "UNKNOWN"

        try:
            result =  evaluate_expression(expression)

            # 비트 크기에 따른 범위 계산
            min_value = -(1 << (bit_size - 1))
            max_value = (1 << (bit_size - 1)) - 1

            # === 오버플로우 처리 ===
            if result < min_value or result > max_value:
                result = (result + (1 << bit_size)) % (1 << bit_size)
            if result > max_value:
                result -= (1 << bit_size)

            now_utc = datetime.now(timezone.utc)
            kst_time = now_utc + timedelta(hours=9)
            kst_time_str = kst_time.strftime('%Y-%m-%d %H:%M:%S.%f')[:-3]
            
            # MongoDB에 저장
            collection.insert_one({
                "mode": "programmer",
                "expression": expression + ' =',
                "result": str(result),
                "date_utc": now_utc,   # datetime 객체로 저장   
                "date": kst_time_str,
                "type": type           
            })

            return JsonResponse({'expression': expression, 'result': str(result)})  # JsonResponse로 결과 반환:
        except Exception:
            result = "Error"
        return JsonResponse({'expression': expression,'result': result})  
    return JsonResponse({'result': 'Invalid request'})





