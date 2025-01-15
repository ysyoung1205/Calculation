import requests
from django.shortcuts import render
from datetime import datetime, timedelta

# def weather1(request):
#     return render(request, 'weatherapi/weather1.html', {'header_title': 'Weather - Weather1'})
    
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
                    "temperature": columns[11],
                    "humidity": columns[13],
                })
        return parsed_data
    else:
        return []


# def get_station_list():
#     API_URL = "https://apihub.kma.go.kr/api/typ01/url/stn_inf.php"
#     API_KEY = "RgiTjT29TKqIk409vUyqBA"
#     params = {
#         "inf": "SFC",     # 관측소 정보 유형 (예: SFC)
#         "stn": "",        # 전체 관측소
#         "tm": "",         # 시간은 빈 값으로 요청
#         "help": 0,        # 도움말 포함 여부
#         "authKey": API_KEY
#     }

#     response = requests.get(API_URL, params=params)

#     if response.status_code == 200:
#         station_data = response.json()  # JSON 응답 파싱
#         # 필요한 정보만 추출 (예: ID와 이름)
#         stations = [{"id": item["stn"], "name": item["name"]} for item in station_data.get("stations", [])]
#         return stations
#     else:
#         print("관측소 정보를 가져오는 데 실패했습니다.")
#         return []
    
def weather1(request):
    """
    기존 weather1 + weatherApi 기능 결합:
    - 페이지 첫 진입 시 (GET 요청) 차트 및 테이블에 필요한 데이터가 함께 렌더링되도록.
    - station, date 파라미터 값에 따라 동적 데이터 표시.
    """
    # 선택된 관측소 및 날짜 기본값 설정
    station = request.GET.get("station", "119")  # 기본 관측소
    date = request.GET.get("date", datetime.now().strftime("%Y-%m-%d"))  # 기본 날짜

    # API로부터 데이터 가져오기
    data = get_weather_data(request)

    # 3번째 값(인덱스 2)부터 슬라이싱하여 사용
    filtered_data = data[2:]
    labels = [item["time"][-4:-2] for item in filtered_data]  # 예: "YYYYMMDDHH"에서 마지막 4자리 중 앞 2자리 = HH
    temperature_data = [item["temperature"] for item in filtered_data]
    humidity_data = [item["humidity"] for item in filtered_data]

    weather_table = [
        {
            "time": item["time"][-4:-2],
            "temperature": item["temperature"],
            "humidity": item["humidity"]
        }
        for item in filtered_data
    ]

    context = {
        "header_title": "Weather - Weather1",          # 기존 weather1의 헤더 타이틀
        "station": station,                            # 템플릿에서 선택된 관측소 표시
        "date": date,                                  # 템플릿에서 선택된 날짜 표시
        "labels": labels,                              # 차트 X축 레이블
        "temperature_data": temperature_data,          # 차트 온도 데이터
        "humidity_data": humidity_data,                # 차트 습도 데이터
        "weather_table": weather_table,                # 테이블 표시용 데이터
        "default_date": datetime.now().strftime("%Y-%m-%d"),  # 화면에서 date input 기본값
    }

    return render(request, 'weatherapi/weather1.html', context)