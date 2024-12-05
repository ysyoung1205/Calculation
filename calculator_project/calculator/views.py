from django.shortcuts import render
from django.http import JsonResponse

# 메인 화면
def index(request):
    return render(request, 'calculator/index.html')

# 계산 처리
def calculate(request):
    if request.method == 'POST':
        expression = request.POST.get('expression', '')  # 입력된 수식
        try:
            result = eval(expression)  # 수식 계산 (주의: 보안 문제 주의)
        except Exception:
            result = "Error"
        return JsonResponse({'expression': expression,'result': result})  # 결과를 JSON으로 반환
    return JsonResponse({'result': 'Invalid request'})

