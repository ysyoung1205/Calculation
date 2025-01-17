import requests
from django.shortcuts import render
from datetime import datetime, timedelta

from django.http import JsonResponse
from pymongo import MongoClient

# def weather1(request):
#     return render(request, 'weatherapi/weather1.html', {'header_title': 'Weather - Weather1'})
    
def get_weather_data(request):
    # 사용자가 선택한 관측소와 날짜 값 가져오기
    station = request.GET.get("station", "119")  # 기본값: 119
    date = request.GET.get("date", datetime.now().strftime("%Y-%m-%d"))  # 기본값: 오늘 날짜

    # 날짜를 기반으로 시간 계산
    start_time = f"{date.replace('-', '')}0000"
    end_time = f"{date.replace('-', '')}2300"
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
        print("parsed_data",parsed_data)
        return parsed_data
    else:
        return []
    
    
def weather1(request):
    # 선택된 관측소 및 날짜 기본값 설정
    station = request.GET.get("station", "119")  # 기본 관측소
    date = request.GET.get("date", datetime.now().strftime("%Y-%m-%d"))  # 기본 날짜

    # API로부터 데이터 가져오기
    data = get_weather_data(request)

    # 3번째 값(인덱스 2)부터 슬라이싱하여 사용
    filtered_data = data[2:]
    labels = [item["time"][-4:-2] for item in filtered_data]  
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
        "header_title": "Weather - 시간(기간)",          
        "station": station,                           
        "date": date,                                 
        "labels": labels,                            
        "temperature_data": temperature_data,       
        "humidity_data": humidity_data,             
        "weather_table": weather_table,              
        "default_date": datetime.now().strftime("%Y-%m-%d"),  
    }

    return render(request, 'weatherapi/weather1.html', context)



def get_dayilyweather_data(request):
    # 사용자가 선택한 관측소와 날짜 값 가져오기
    station = request.GET.get("station", "119")  # 기본값: 119
    start_date= request.GET.get("start_date", "2025-01-13")  # 기본값: 오늘 날짜
    end_date = request.GET.get("end_date", "2025-01-15")  # 기본값: 오늘 날짜
    # 날짜를 기반으로 시간 계산 (YYYY-MM-DD → YYYYMMDD 형식 변환)
    start_date = start_date.replace("-", "")
    end_date = end_date.replace("-", "")

    API_URL = "https://apihub.kma.go.kr/api/typ01/url/kma_sfcdd3.php"
    API_KEY = "RgiTjT29TKqIk409vUyqBA"
    params = {
        "tm1": start_date,
        "tm2": end_date,
        "stn": station,         # 지점 번호 (0 = 전체)
        "help": 0,
        "authKey": API_KEY
    }
    response = requests.get(API_URL, params=params)
    print("response",response.text)

    # 응답 데이터 처리
    if response.status_code == 200:
        data = response.text
        #  `#START7777`과 `#7777END` 인덱스 찾기
        lines = data.split("\n")
        start_idx = next((i for i, line in enumerate(lines) if "#START7777" in line), None)
        end_idx = next((i for i, line in enumerate(lines) if "#7777END" in line), None)

        if start_idx is None or end_idx is None or start_idx + 3 >= end_idx:


            return JsonResponse({"error": "No valid data found"}, status=200)

        valid_lines = lines[start_idx:end_idx] 
         
        # 데이터 정리
        parsed_data = []
        for line in valid_lines:
            columns = line.split()
            if len(columns) >= 14:  # 필요한 열만 가져
                parsed_data.append({
                    "TM": columns[0],
                    "STN": columns[1],
                    "TA_AVG": columns[10],
                    "TA_MAX": columns[11],
                    "TA_MIN": columns[13],
                })   
        return parsed_data
    else:
         return JsonResponse({"error": "Failed to fetch data"}, status=response.status_code)  # ❌ JsonResponse 반환
    

def weather2(request):
    # 선택된 관측소 및 날짜 기본값 설정
    station = request.GET.get("station", "119")  # 기본값: 119
    start_date= request.GET.get("start_date", "2025-01-13")  # 기본값: 오늘 날짜
    end_date = request.GET.get("end_date", "2025-01-15")  # 기본값: 오늘 날짜

    # API로부터 데이터 가져오기
    data = get_dayilyweather_data(request)

    filtered_data = data[3:]
    labels = [item["TM"] for item in filtered_data]
    TA_AVG = [item["TA_AVG"] for item in filtered_data]
    TA_MAX = [item["TA_MAX"] for item in filtered_data]
    TA_MIN = [item["TA_MIN"] for item in filtered_data]

    # weather_table = [
    #     {
    #         "TM": item["TM"],
    #         "TA_AVG": item["TA_AVG"],
    #         "TA_MAX": item["TA_MAX"],
    #         "TA_MIN": item["TA_MIN"]
    #     }
    #     for item in filtered_data
    # ]

    context = {
        "header_title": "Weather - 날짜(기간)",          
        "station": station,                           
        "start_date": start_date,                                 
        "end_date": end_date,                                 
        "labels": labels,                            
        "ta_avg": TA_AVG,       
        "ta_max": TA_MAX,             
        "ta_min": TA_MIN,             
        # "weather_table": weather_table,              
        # "default_date": datetime.now().strftime("%Y-%m-%d"),  
    }

    return render(request, 'weatherapi/weather2.html', context)






# def get_daily_weather_data(request):
#     """
#     start_date ~ end_date, station을 GET 파라미터로 받아
#     외부 API를 호출한 뒤, MongoDB에 (중복되지 않게) 저장.
#     반환값: {"result": "success"} (HttpResponse가 아니라 단순 dict)
    
#     """
#     # 1) 파라미터 설정
#     start_date_str = request.GET.get("start_date", datetime.now().strftime("%Y-%m-%d"))
#     end_date_str   = request.GET.get("end_date",   datetime.now().strftime("%Y-%m-%d"))
#     station        = request.GET.get("station", "108")  # 기본 지점 (예: 108=서울)
#     print(start_date_str)
#     print(end_date_str)
#     print(station)

#     # 2) 날짜 문자열을 datetime 객체로 변환
#     start_date = datetime.strptime(start_date_str, "%Y-%m-%d")
#     end_date   = datetime.strptime(end_date_str,   "%Y-%m-%d")
    
#     # 3) MongoDB 연결 (예시)
#     client = MongoClient("mongodb://localhost:27017")  
#     db = client["weatherapi"]      # DB 이름
#     collection = db["weather_AVG"] # 컬렉션 이름

#     # # 3) 결과를 담을 리스트
#     # all_results = []

#     # 4) start_date ~ end_date 날짜별로 반복 호출
#     # curr_date = start_date
#     # while curr_date <= end_date:
#     #     # (1) API에서 요구하는 tm=YYYYMMDD 형태 만들기
#     #     tm_value = curr_date.strftime("%Y%m%d")  # 예: 20250101

#     # (2) API 파라미터 설정
#     API_URL = "https://apihub.kma.go.kr/api/typ01/url/kma_sfcdd3.php"  # 일자료용 엔드포인트(예시)
#     API_KEY = "RgiTjT29TKqIk409vUyqBA"  # 실제 인증키로 변경
    
#     tm1 = start_date.strftime("%Y%m%d")  # YYYYMMDD
#     tm2 = end_date.strftime("%Y%m%d")    # YYYYMMDD
#     print(tm1)

#     params = {
#         "tm1": tm1,
#         "tm2": tm2,
#         "stn": station,      # 지점번호
#         "help": 0,           # 보통 0 또는 1
#         "authKey": API_KEY
#     }

#     # (3) API 호출
#     response = requests.get(API_URL, params=params)
#     if response.status_code == 200:
#         data = response.text
#         lines = data.split("\n")

#         # #START7777 ~ #7777END 구간 추출
#         try:
#             start_idx = next(i for i, line in enumerate(lines) if "#START7777" in line) + 1
#             end_idx   = next(i for i, line in enumerate(lines) if "#7777END"   in line)
#         except StopIteration:
#             print("No #START7777 or #7777END found.")
#             return

#         valid_lines = lines[start_idx:end_idx]

#         # (4) 필요한 값 파싱
#         #     0: TM(관측일), 10: TA_AVG, 11: TA_MAX, 13: TA_MIN
#         for line in valid_lines:
#             columns = line.split()
#             if len(columns) >= 14:  # 최소 14열 이상이어야 함
#                 record = {
#                     "TM": columns[0],       # 관측일
#                     "STN": columns[1],       # 관측일
#                     "TA_AVG": columns[10],  # 일 평균기온
#                     "TA_MAX": columns[11],  # 최고기온
#                     "TA_MIN": columns[13],  # 최저기온
#                 }
#                 # 5) MongoDB에 중복 저장 방지
#                 existing_doc = collection.find_one({"TM": record["TM"], "STN": record["STN"]})
#                 if not existing_doc:
#                     # 없다면 삽입
#                     collection.insert_one(record)
#                 print("Inserted multi-day data from", tm1, "to", tm2)
#                 # else: 이미 있다면 저장 스킵
#                 # all_results.append(record)

#             # 다음 날짜로 +1
#             curr_date += timedelta(days=1)    

#             print(f"Response status: {response.status_code}")
#             print(f"Response text: {response.text[:200]}")  # 너무 긴 응답은 자르기

            
#     return {"result": "success"}
#     # # 5) 최종 결과 반환
#     # return all_results


# # MongoDB 설정
# MONGO_URI = "mongodb://localhost:27017/"
# DB_NAME = "weatherapi"
# COLLECTION_NAME = "weather_AVG"

# def weather2(request):
#     """
#     1) get_daily_weather_data(request)를 호출하여 start_date ~ end_date, station 범위의 데이터를 외부 API에서 가져와 DB에 저장.
#     2) 그 뒤 MongoDB에서 해당 station, 기간에 해당하는 데이터를 읽어와서 차트로 표시.
    
#     """
#     today = datetime.now()
#     default_start_date = (today - timedelta(days=3)).strftime("%Y-%m-%d")  # 오늘 - 3일
#     default_end_date = (today - timedelta(days=1)).strftime("%Y-%m-%d")    # 오늘 - 1일

#     # 2) GET 파라미터로부터 station, start_date, end_date 가져오기
#     station = request.GET.get("station", "119")  # 없으면 119
#     start_date = request.GET.get("start_date", "")
#     end_date = request.GET.get("end_date", "")

#     # 3) 비어 있으면 기본값으로 대체
#     if not start_date:
#         start_date = default_start_date
#     if not end_date:
#         end_date = default_end_date

#     # DB에서 조회 (weather_AVG 컬렉션)
#     client = MongoClient(MONGO_URI)
#     db = client[DB_NAME]
#     collection = db[COLLECTION_NAME]

#     try:
#         # MongoDB에서 선택된 관측소와 기간에 해당하는 데이터 조회
#         query = {
#             "stn": station,
#             "tm": {"$gte": start_date.replace("-", ""), "$lte": end_date.replace("-", "")},
#         }
#         weather_data = list(collection.find(query, {"_id": 0}))  # `_id` 필드 제외

#         # 데이터 정리 (차트를 위한 데이터)
#         labels = [data["tm"] for data in weather_data]
#         ta_max = [data["ta_max"] for data in weather_data]  # 최고기온
#         ta_min = [data["ta_min"] for data in weather_data]  # 최저기온
#         ta_avg = [data["ta_avg"] for data in weather_data]  # 일평균기온

#         # 템플릿으로 데이터 전달
#         context = {
#             "station": station,
#             "start_date": start_date,
#             "end_date": end_date,
#             "labels": labels,
#             "ta_max": ta_max,
#             "ta_min": ta_min,
#             "ta_avg": ta_avg,
#             # "default_start_date": default_start_date,
#             # "default_end_date": default_end_date,
#         }
#         return render(request, "weatherapi/weather2.html", context)
#     except Exception as e:
#         return render(request, "weatherapi/weather2.html", {"error": str(e)})
#     finally:
#         client.close()


# def weather_chart_view(request):
#     """
#     Weather 데이터 시각화를 위한 HTML 렌더링.
#     """
#     return render(request, "weather_api/weather2.html")
