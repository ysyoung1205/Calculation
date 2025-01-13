
# import requests
# from django.shortcuts import render

# # API 정보
# API_URL = "https://apihub.kma.go.kr/api/typ01/url/kma_sfctm2.php"
# API_KEY = "RgiTjT29TKqIk409vUyqBA"  # 발급받은 API Key
# TIME = "202411111300"  # 요청 시간 (예: 2025년 1월 13일 09:00)
# STATION = 0  # 지점 번호 (전체: 0)

# # 요청 파라미터
# params = {
#     "tm": TIME,          # 관측 시간
#     "stn": STATION,      # 지점번호 (0은 전체)
#     "help": 0,           # 도움말 포함 여부 (0은 데이터만 반환)
#     "authKey": API_KEY   # API 인증 키
# }

# # API 요청 보내기
# response = requests.get(API_URL, params=params)

# # 응답 처리
# if response.status_code == 200:
#     data = response.text  # 텍스트로 데이터 읽기
#     lines = data.split("\n")  # 줄 단위로 나누기
    
#     # 유효한 데이터 라인만 추출 (START7777와 END7777 사이의 데이터)
#     start_idx = next(i for i, line in enumerate(lines) if "#START7777" in line) + 1
#     end_idx = next(i for i, line in enumerate(lines) if "#7777END" in line)
#     valid_lines = lines[start_idx:end_idx]

#     # 각 줄의 데이터를 파싱하여 리스트로 변환
#     parsed_data = []
#     for line in valid_lines:
#         columns = line.split()  # 공백을 기준으로 열 나누기
#         if len(columns) >= 14:  # 최소한 14개 열이 있어야 함 (예: 기온과 습도 열 포함)
#             parsed_data.append({
#                 "time": columns[0],          # 관측 시간
#                 "station": columns[1],       # 지점 번호
#                 "wind_direction": columns[2], # 풍향
#                 "wind_speed": columns[3],    # 풍속
#                 "temperature": columns[12],  # 기온 (°C)
#                 "humidity": columns[13]      # 습도 (%)
#             })
#         else:
#             print(f"유효하지 않은 데이터 스킵: {line}")  # 디버깅을 위해 출력

#     # 결과 출력
#     for entry in parsed_data:
#         print(entry)

# else:
#     print(f"API 요청 실패: {response.status_code}")
#     print(response.text)

    

# def chart_view(request):
#     # MongoDB에서 데이터 가져오기 (여기선 임의의 데이터 사용)
#     labels = ["2025-01-13 09:00", "2025-01-13 10:00", "2025-01-13 11:00"]  # 시간
#     temperature_data = [-11.4, -10.5, -9.8]  # 온도 데이터
#     humidity_data = [38, 42, 37]  # 습도 데이터

#     # 템플릿에 전달할 데이터
#     context = {
#         "labels": labels,
#         "temperature_data": temperature_data,
#         "humidity_data": humidity_data,
#     }
#     return render(request, "weatherapi/weather_table.html", context)
# from django.shortcuts import render
# from django.http import JsonResponse
# from .services import WeatherAPIClient

# from django.http import JsonResponse
# from .services import WeatherAPIClient
# from pymongo import MongoClient

# def fetch_and_save_weather(request):
#     try:
#         data = WeatherAPIClient.fetch_weather_data()
        
#         # MongoDB에 데이터 저장
#         client = MongoClient('mongodb://localhost:27017/')
#         db = client.weather_db
#         collection = db.weather_data
#         collection.insert_one(data)

#         return JsonResponse({"status": "success", "data": data})
#     except Exception as e:
#         return JsonResponse({"status": "error", "message": str(e)})
import requests
from django.shortcuts import render
from datetime import datetime, timedelta

# 
def get_weather_data(request):
    # 사용자가 선택한 관측소와 날짜 값 가져오기
    station = request.GET.get("station", "119")  # 기본값: 119
    date = request.GET.get("date", datetime.now().strftime("%Y-%m-%d"))  # 기본값: 오늘 날짜

    # 날짜를 기반으로 시간 계산
    start_time = f"{date.replace('-', '')}0000"
    end_time = f"{date.replace('-', '')}2300"
    # 사용자가 요청한 날짜와 시간 (예: '202501130900')
    # requested_time = request.GET.get('time', '202501130900')  # 기본값 설정
    # requested_stn = request.GET.get('stn', '90')  # 기본값 설정
# https://apihub.kma.go.kr/api/typ01/url/kma_sfctm3.php?tm1=202501130900&tm2=202501131500&stn=119&help=1&authKey=Pi8YfpSBTPivGH6Ugaz4Kg
    # API 요청
    API_URL = "https://apihub.kma.go.kr/api/typ01/url/kma_sfctm3.php"
    API_KEY = "RgiTjT29TKqIk409vUyqBA"
    params = {
        "tm1": start_time,
        "tm2": end_time,
        "stn": station,         # 지점 번호 (0 = 전체)
        "help": 0,
        "authKey": API_KEY
    }

    response = requests.get(API_URL, params=params)

    # 응답 데이터 처리
    if response.status_code == 200:
        data = response.text
        # 데이터 파싱 (START7777 ~ 7777END 사이만 추출)
        lines = data.split("\n")
        start_idx = next(i for i, line in enumerate(lines) if "#START7777" in line) + 1
        end_idx = next(i for i, line in enumerate(lines) if "#7777END" in line)
        valid_lines = lines[start_idx:end_idx]
        # 데이터 정리
        parsed_data = []
        for line in valid_lines:
            columns = line.split()
            if len(columns) >= 14:  # 필요한 열만 가져옴
                parsed_data.append({
                    "time": columns[0],
                    "temperature": columns[12],
                    "humidity": columns[13],
                })
        return parsed_data
    else:
        return []

    

def chart_view(request):
    # API 데이터 가져오기
    data = get_weather_data(request)


    # 3번째 값부터 가져오기
    filtered_data = data[2:]  # 인덱스 2부터 끝까지 슬라이싱


    labels = [item["time"][-4:-2] for item in filtered_data]  # 마지막 4~2번째 문자 추출 (시간 부분)
    temperature_data = [item["temperature"] for item in filtered_data]
    humidity_data = [item["humidity"] for item in filtered_data]

    # 템플릿에 전달할 데이터
    context = {
        "labels": labels,
        "temperature_data": temperature_data,
        "humidity_data": humidity_data,
        "default_date": datetime.now().strftime("%Y-%m-%d"),  # 기본 날짜
    }

    return render(request, "weatherapi/weather_table.html", context)