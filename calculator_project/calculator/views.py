from django.shortcuts import render
from django.http import JsonResponse
from sympy import sympify

# 메인 화면
def index(request):
    return render(request, 'calculator/index.html')  #계산기 화면 보여주기

# 계산 처리
def calculate(request):
    if request.method == 'POST':
        expression = request.POST.get('expression', '')  #입력된 수식
        try:
            result = sympify(expression)  # sympy 수식 안전하게 평가
            result = float(result)  # 결과를 기본 타입으로 변환
            #result = eval(expression)  # 보안 문제 주의
        except Exception:
            result = "Error"
        return JsonResponse({'expression': expression,'result': result})  
    return JsonResponse({'result': 'Invalid request'})

# 계산 처리
def Pcalculate(request):
    if request.method == 'POST':
        expression = request.POST.get('expression', '')  #입력된 수식
        try:
            result = sympify(expression) 
            return JsonResponse({'expression': expression, 'result': str(result)})  # JsonResponse로 결과 반환:
        except Exception:
            result = "Error"
        return JsonResponse({'expression': expression,'result': result})  
    return JsonResponse({'result': 'Invalid request'})

def programmers_calculator(request):
    return render(request, 'calculator/Programmers_Calculator.html')

